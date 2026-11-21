import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from .models import InvestmentPool, InvestorPosition, TradeSession, SessionDistribution, NAVHistory
from billing.models import DepositRequest, WithdrawalRequest, TransactionLedger
from notifications.utils import broadcast_public_event, broadcast_to_user, broadcast_to_admins

class InvestmentService:
    @staticmethod
    def get_or_create_position(user):
        position, _ = InvestorPosition.objects.get_or_create(user=user)
        return position

    @staticmethod
    @transaction.atomic
    def credit_deposit(deposit_id, admin_user):
        """Admin tomonidan P2P depozit cheki tasdiqlanganda chaqiriladi"""
        deposit = DepositRequest.objects.select_for_update().get(id=deposit_id)
        if deposit.status != 'PENDING':
            raise ValueError("Ushbu depozit allaqachon ko‘rib chiqilgan.")

        pool = InvestmentPool.objects.select_for_update().get(id=1)
        
        amount_usd = deposit.amount_usd
        if amount_usd <= 0:
            raise ValueError("Depozit summasi 0 dan katta bo‘lishi shart.")

        # Joriy NAV bo'yicha units hisoblash
        current_nav = pool.current_nav if pool.current_nav > 0 else Decimal('1.0000')
        units_to_credit = round(amount_usd / current_nav, 4)

        # Poolni yangilash
        pool.total_units += units_to_credit
        pool.total_equity_usd += amount_usd
        if pool.total_equity_usd > pool.high_water_mark:
            pool.high_water_mark = pool.total_equity_usd
        pool.save()

        # Investor pozitsiyasini yangilash
        position = InvestmentService.get_or_create_position(deposit.user)
        position.units += units_to_credit
        position.total_deposited_usd += amount_usd
        position.save()

        # Depozit statusini yangilash
        deposit.status = 'APPROVED'
        deposit.units_credited = units_to_credit
        deposit.approved_by = admin_user
        deposit.resolved_at = timezone.now()
        deposit.save()

        # Foydalanuvchiga XP ball berish (+50 XP har $100 uchun)
        xp_earned = int((amount_usd / 100) * 50) or 20
        deposit.user.xp_points += xp_earned
        deposit.user.save(update_fields=['xp_points'])

        # Double-entry Ledger yozuvi
        TransactionLedger.objects.create(
            user=deposit.user,
            tx_type='DEPOSIT',
            amount_usd=amount_usd,
            amount_uzs=deposit.amount_uzs,
            units_delta=units_to_credit,
            balance_after_usd=position.current_value_usd,
            description=f"P2P Depozit tasdiqlandi (#{deposit.deposit_id}). +{units_to_credit} Units berildi."
        )

        # NAV tarixiga yozish
        NAVHistory.objects.create(
            nav=pool.current_nav,
            total_units=pool.total_units,
            total_equity_usd=pool.total_equity_usd,
            event_type='DEPOSIT',
            note=f"Depozit: {deposit.user.full_name} (+${amount_usd})"
        )

        # WebSocket xabarlari
        broadcast_to_user(deposit.user.id, 'deposit_approved', {
            'deposit_id': deposit.deposit_id,
            'amount_usd': str(amount_usd),
            'units_credited': str(units_to_credit),
            'current_value_usd': str(position.current_value_usd),
            'xp_earned': xp_earned,
            'message': f"Sizning ${amount_usd} miqdoridagi depozitingiz tasdiqlandi va {units_to_credit} Units qo‘shildi!"
        })

        broadcast_public_event('new_activity_ticker', {
            'name': deposit.user.full_name.split()[0] if deposit.user.full_name else "Investor",
            'action': f"${int(amount_usd):,} depozit qildi va investitsiyaga kirdi",
            'type': 'DEPOSIT'
        })

        return deposit

    @staticmethod
    @transaction.atomic
    def execute_trade_session(gross_profit_usd, trader_type='XF', trader_user=None, notes="", admin_user=None):
        """Admin '70$ foyda yopdim' deb kiritganda yoki zararda ishga tushadigan universal taqsimot mexanizmi"""
        pool = InvestmentPool.objects.select_for_update().get(id=1)
        gross_profit = Decimal(str(gross_profit_usd))

        if pool.total_units <= 0:
            raise ValueError("Platformada faol Units mavjud emas. Avval investorlar depozit kiritishi kerak.")

        nav_before = pool.current_nav
        total_units = pool.total_units

        # Ulushlarni hisoblash
        if trader_type == 'XF':
            # 50% XF / 50% Investorlar
            xf_share = round(gross_profit * Decimal('0.50'), 2)
            trader_share = Decimal('0.00')
            investors_share = gross_profit - xf_share
        else:
            # 25% XF / 25% Treyder / 50% Investorlar
            xf_share = round(gross_profit * Decimal('0.25'), 2)
            trader_share = round(gross_profit * Decimal('0.25'), 2)
            investors_share = gross_profit - (xf_share + trader_share)

        session_id = f"TS-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        trade_session = TradeSession.objects.create(
            session_id=session_id,
            trader_type=trader_type,
            trader=trader_user,
            gross_profit_usd=gross_profit,
            xf_share_usd=xf_share,
            trader_share_usd=trader_share,
            investors_share_usd=investors_share,
            nav_before=nav_before,
            nav_after=nav_before, # Hozircha
            total_units_snapshot=total_units,
            notes=notes
        )

        # Agar tashqi treyder bo'lsa, uning o'ziga ham ulush o'tkazish
        if trader_user and trader_share > 0:
            trader_pos = InvestmentService.get_or_create_position(trader_user)
            trader_pos.total_profit_earned_usd += trader_share
            trader_pos.save()
            TransactionLedger.objects.create(
                user=trader_user,
                tx_type='PROFIT_SHARE',
                amount_usd=trader_share,
                units_delta=Decimal('0.0000'),
                balance_after_usd=trader_pos.current_value_usd,
                description=f"Treyder savdo ulushi (Sessiya #{session_id}): +${trader_share}"
            )
            broadcast_to_user(trader_user.id, 'trader_profit_credited', {
                'session_id': session_id,
                'trader_share': str(trader_share)
            })

        # Har bir investorni topib proporsional taqsimlash
        positions = InvestorPosition.objects.filter(units__gt=0).select_related('user', 'user__referred_by')

        for pos in positions:
            ratio = pos.units / total_units
            user_gross_share = round(investors_share * ratio, 2)

            # 5% Referal tizimi
            # "taklif qilgan odamini foydasidan 5%"
            ref_deducted = Decimal('0.00')
            user_net_share = user_gross_share
            referrer = pos.user.referred_by

            if referrer and user_gross_share > 0:
                ref_deducted = round(user_gross_share * Decimal('0.05'), 2)
                user_net_share = user_gross_share - ref_deducted

                # Taklif qilgan odam (referrer) ga 5% berish
                referrer_pos = InvestmentService.get_or_create_position(referrer)
                referrer_pos.referral_earnings_usd += ref_deducted
                referrer_pos.save()

                TransactionLedger.objects.create(
                    user=referrer,
                    tx_type='REFERRAL_BONUS',
                    amount_usd=ref_deducted,
                    units_delta=Decimal('0.0000'),
                    balance_after_usd=referrer_pos.current_value_usd,
                    description=f"Referal bonusi: {pos.user.full_name} foydasidan 5% (+${ref_deducted})"
                )

                # Referrerga XP ball (+10 XP)
                referrer.xp_points += 10
                referrer.save(update_fields=['xp_points'])

                broadcast_to_user(referrer.id, 'referral_bonus_credited', {
                    'amount_usd': str(ref_deducted),
                    'from_user': pos.user.full_name,
                    'message': f"Hamkoringiz {pos.user.full_name} foydasidan 5% (+${ref_deducted}) referal bonusi tushdi!"
                })

            # Investorning o'z pozitsiyasini yangilash
            pos.total_profit_earned_usd += user_net_share
            pos.save()

            # Sessiya taqsimot auditiga yozish
            SessionDistribution.objects.create(
                session=trade_session,
                investor=pos.user,
                units_at_session=pos.units,
                gross_share_usd=user_gross_share,
                referral_deducted_usd=ref_deducted,
                net_share_usd=user_net_share,
                referrer=referrer
            )

            # Investorning Ledgeriga yozish
            TransactionLedger.objects.create(
                user=pos.user,
                tx_type='PROFIT_SHARE' if user_net_share >= 0 else 'LOSS_SHARE',
                amount_usd=user_net_share,
                units_delta=Decimal('0.0000'),
                balance_after_usd=pos.current_value_usd,
                description=f"Savdo sessiyasi taqsimoti (#{session_id}): {'+' if user_net_share>=0 else ''}${user_net_share}"
            )

            # Shaxsiy bildirishnoma yuborish
            broadcast_to_user(pos.user.id, 'profit_distributed', {
                'session_id': session_id,
                'gross_profit': str(gross_profit),
                'your_net_share': str(user_net_share),
                'current_value_usd': str(pos.current_value_usd),
                'message': f"Savdo sessiyasi yakunlandi: hisobingizga +${user_net_share} sof foyda qo‘shildi!"
            })

        # Pool Equity va NAV ni yangilash
        pool.total_equity_usd += investors_share
        new_nav = round(pool.total_equity_usd / pool.total_units, 4)
        pool.current_nav = new_nav
        if pool.total_equity_usd > pool.high_water_mark:
            pool.high_water_mark = pool.total_equity_usd
        pool.save()

        # Trade session recordini yakunlash
        trade_session.nav_after = new_nav
        trade_session.save(update_fields=['nav_after'])

        # NAV tarixiga yozish
        NAVHistory.objects.create(
            nav=new_nav,
            total_units=pool.total_units,
            total_equity_usd=pool.total_equity_usd,
            event_type='SESSION_PROFIT' if gross_profit >= 0 else 'SESSION_LOSS',
            note=f"Sessiya #{session_id}: Gross ${gross_profit} -> Yangi NAV: ${new_nav}"
        )

        # Public xabar: barcha ekranlarda grafik va NAV o'zgaradi
        broadcast_public_event('trade_session_completed', {
            'session_id': session_id,
            'gross_profit_usd': str(gross_profit),
            'investors_share_usd': str(investors_share),
            'new_nav': str(new_nav),
            'total_equity_usd': str(pool.total_equity_usd)
        })

        broadcast_public_event('new_activity_ticker', {
            'name': "XF Master",
            'action': f"Savdo sessiyasida +${int(gross_profit)} foyda olindi va 50/50 taqsimlandi",
            'type': 'PROFIT'
        })

        return trade_session

    @staticmethod
    @transaction.atomic
    def process_withdrawal_approval(withdrawal_id, admin_user, approved=True, admin_notes=""):
        """Admin pul yechish so'rovini tasdiqlaganida va to'lovni bajarganida chaqiriladi"""
        withdrawal = WithdrawalRequest.objects.select_for_update().get(id=withdrawal_id)
        if withdrawal.status not in ['PENDING', 'APPROVED']:
            raise ValueError("Ushbu so‘rov allaqachon yakunlangan.")

        pool = InvestmentPool.objects.select_for_update().get(id=1)
        position = InvestorPosition.objects.select_for_update().get(user=withdrawal.user)

        if not approved:
            withdrawal.status = 'REJECTED'
            withdrawal.admin_notes = admin_notes
            withdrawal.resolved_at = timezone.now()
            withdrawal.save()

            broadcast_to_user(withdrawal.user.id, 'withdrawal_rejected', {
                'withdrawal_id': withdrawal.withdrawal_id,
                'reason': admin_notes,
                'message': f"Pul yechish so‘rovingiz rad etildi: {admin_notes}"
            })
            return withdrawal

        # Pul yechishda units miqdorini kamaytirish
        units_to_redeem = withdrawal.units_to_redeem
        if position.units < units_to_redeem:
            raise ValueError("Foydalanuvchida yetarli units mavjud emas.")

        position.units -= units_to_redeem
        position.total_withdrawn_usd += withdrawal.amount_usd
        position.save()

        pool.total_units -= units_to_redeem
        pool.total_equity_usd -= withdrawal.amount_usd
        if pool.total_units > 0:
            pool.current_nav = round(pool.total_equity_usd / pool.total_units, 4)
        pool.save()

        withdrawal.status = 'PAID'
        withdrawal.admin_notes = admin_notes
        withdrawal.resolved_at = timezone.now()
        withdrawal.save()

        TransactionLedger.objects.create(
            user=withdrawal.user,
            tx_type='WITHDRAWAL',
            amount_usd=withdrawal.amount_usd,
            amount_uzs=withdrawal.amount_uzs,
            units_delta=-units_to_redeem,
            balance_after_usd=position.current_value_usd,
            description=f"Pul yechildi (#{withdrawal.withdrawal_id}) -> Karta: {withdrawal.target_card_number}"
        )

        NAVHistory.objects.create(
            nav=pool.current_nav,
            total_units=pool.total_units,
            total_equity_usd=pool.total_equity_usd,
            event_type='WITHDRAWAL',
            note=f"Chiqarildi: {withdrawal.user.full_name} (-${withdrawal.amount_usd})"
        )

        broadcast_to_user(withdrawal.user.id, 'withdrawal_paid', {
            'withdrawal_id': withdrawal.withdrawal_id,
            'amount_usd': str(withdrawal.amount_usd),
            'amount_uzs': str(withdrawal.amount_uzs),
            'target_card': withdrawal.target_card_number,
            'message': f"${withdrawal.amount_usd} ({withdrawal.amount_uzs:,.0f} so‘m) kartangizga o‘tkazildi!"
        })

        broadcast_public_event('new_activity_ticker', {
            'name': withdrawal.user.full_name.split()[0] if withdrawal.user.full_name else "Investor",
            'action': f"${int(withdrawal.amount_usd):,} daromad yechib oldi",
            'type': 'WITHDRAW'
        })

        return withdrawal

