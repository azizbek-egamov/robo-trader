from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from investments.models import InvestmentPool, InvestorPosition, NAVHistory
from billing.models import P2PCardSetting, TransactionLedger
from prop_trading.models import PropExam

User = get_user_model()

class Command(BaseCommand):
    help = "Dastlabki ma'lumotlarni (Admin, P2P karta, 3 ta test investor va Fund pool) bazaga kiritadi"

    def handle(self, *args, **options):
        self.stdout.write("Baza ma'lumotlari kiritilmoqda...")

        # 1. Admin yaratish
        admin, created = User.objects.get_or_create(
            phone="+998975600600",
            defaults={
                'full_name': "Sardorbek Vaisov (Admin)",
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'xp_points': 5000,
                'referral_code': 'XFADMIN'
            }
        )
        if created:
            admin.set_password("admin123")
            admin.save()
            self.stdout.write(self.style.SUCCESS(f"Admin yaratildi: {admin.phone} (parol: admin123)"))
        else:
            self.stdout.write(f"Admin mavjud: {admin.phone}")

        # 2. P2P Karta sozlamasi
        card, card_created = P2PCardSetting.objects.get_or_create(
            id=1,
            defaults={
                'card_number': "8600 5704 1234 5678",
                'card_holder': "SARDORBEK VAISOV",
                'bank_name': "Agrobank / Uzcard",
                'exchange_rate_usd_uzs': Decimal('12800.00'),
                'is_active': True
            }
        )
        if card_created:
            self.stdout.write(self.style.SUCCESS(f"P2P Karta yaratildi: {card.card_number}"))

        # 3. Investment Pool
        pool = InvestmentPool.get_pool()
        pool.name = "XF CopyTrade Master Pool"
        pool.current_nav = Decimal('1.0000')
        pool.total_units = Decimal('6000.0000')
        pool.total_equity_usd = Decimal('6000.00')
        pool.high_water_mark = Decimal('6000.00')
        pool.total_investors_count = 3
        pool.save()

        # 4. 3 ta boshlang'ich investor (TZ dagi ssenariy)
        investors_data = [
            ("+998901112233", "Jasurbek Aliyev", Decimal('1000.00'), None),
            ("+998902223344", "Dilshodbek Karimov", Decimal('2000.00'), None),
            ("+998903334455", "Shahnoza Rahimova", Decimal('3000.00'), "+998901112233"), # Jasurbek taklif qilgan
        ]

        jasurbek_user = None
        for phone, name, deposit_amount, ref_phone in investors_data:
            ref_user = jasurbek_user if ref_phone else None
            u, u_created = User.objects.get_or_create(
                phone=phone,
                defaults={
                    'full_name': name,
                    'role': 'INVESTOR',
                    'referred_by': ref_user,
                    'xp_points': int(deposit_amount / 2)
                }
            )
            if u_created:
                u.set_password("investor123")
                u.save()

            if phone == "+998901112233":
                jasurbek_user = u

            pos, _ = InvestorPosition.objects.get_or_create(user=u)
            pos.units = deposit_amount # 1 NAV = $1.00 -> units = deposit
            pos.total_deposited_usd = deposit_amount
            pos.save()

            TransactionLedger.objects.get_or_create(
                user=u,
                tx_type='DEPOSIT',
                amount_usd=deposit_amount,
                defaults={
                    'amount_uzs': deposit_amount * Decimal('12800.00'),
                    'units_delta': deposit_amount,
                    'balance_after_usd': deposit_amount,
                    'description': f"Boshlang‘ich depozit (${deposit_amount})"
                }
            )

        # NAV Tarixiga yozish
        NAVHistory.objects.get_or_create(
            event_type='INITIAL',
            defaults={
                'nav': Decimal('1.0000'),
                'total_units': Decimal('6000.0000'),
                'total_equity_usd': Decimal('6000.00'),
                'note': "XF CopyTrade Pool ishga tushirildi: $6,000 boshlang‘ich kapital"
            }
        )

        # 5. Bitta namunaviy test prop imtihon arizasi
        PropExam.objects.get_or_create(
            exam_id="PROP-SAMPLE01",
            defaults={
                'user': jasurbek_user,
                'fee_uzs': Decimal('100000.00'),
                'card_info_used': "Uzcard 8600 **** 1234",
                'status': 'ACTIVE',
                'mt5_login': '8849201',
                'mt5_password': 'TraderPass2026!',
                'mt5_server': 'Alpari-MT5-Demo',
                'demo_balance_usd': Decimal('10000.00'),
                'target_profit_percent': Decimal('9.00'),
                'max_loss_percent': Decimal('6.00'),
                'daily_loss_percent': Decimal('4.00')
            }
        )

        self.stdout.write(self.style.SUCCESS("Barcha boshlang‘ich ma'lumotlar muvaffaqiyatli kiritildi!"))

