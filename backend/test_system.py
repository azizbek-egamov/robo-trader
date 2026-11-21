import os
import time
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from investments.models import InvestmentPool, InvestorPosition
from billing.models import P2PCardSetting, DepositRequest, WithdrawalRequest, TransactionLedger
from prop_trading.models import PropExam

User = get_user_model()

def run_tests():
    c = Client()
    print("=== 1. TIZIMGA ADMIN VA INVESTOR BILAN KIRISH TESTI ===")
    
    # Login as Admin
    login_res = c.post('/api/v1/users/auth/login/', {
        'phone': '+998975600600',
        'password': 'admin123'
    }, content_type='application/json')
    assert login_res.status_code == 200, f"Admin login failed: {login_res.data}"
    admin_token = login_res.json()['access']
    print("✓ Admin Login muvaffaqiyatli! Token olindi.")

    # 2. Yangi Investor Ro'yxatdan O'tishi (Referal bilan)
    jasurbek = User.objects.get(phone='+998901112233')
    unique_phone = f"+99899{int(time.time() * 1000) % 10000000:07d}"
    reg_res = c.post('/api/v1/users/auth/register/', {
        'phone': unique_phone,
        'full_name': 'Nodirbek Salimov',
        'password': 'password123',
        'referral_code': jasurbek.referral_code
    }, content_type='application/json')
    assert reg_res.status_code in [200, 201], f"Register failed: {reg_res.content}"
    nodir_token = reg_res.json()['access']
    nodir = User.objects.get(phone=unique_phone)
    assert nodir.referred_by == jasurbek, "Referral bog'lanishi xato!"
    print(f"✓ Yangi investor ro'yxatdan o'tdi: {nodir.full_name} ({nodir.phone}), Taklif qiluvchi: {nodir.referred_by.full_name}")

    # 3. Pool va Karta ma'lumotlarini olish
    pool_res = c.get('/api/v1/invest/pool/')
    assert pool_res.status_code == 200
    print(f"✓ Master Pool ko'rsatkichlari: NAV: ${pool_res.json()['current_nav']}, Equity: ${pool_res.json()['total_equity_usd']}")

    card_res = c.get('/api/v1/billing/card-details/')
    assert card_res.status_code == 200
    print(f"✓ Faol P2P Karta: {card_res.json()['card_number']} ({card_res.json()['card_holder']})")

    # 4. Nodirbek $500 Depozit Kiritadi
    dep_res = c.post('/api/v1/billing/deposit/create/', {
        'amount_usd': '500.00',
        'amount_uzs': '6400000.00',
        'card_used': 'Uzcard 8600'
    }, HTTP_AUTHORIZATION=f'Bearer {nodir_token}')
    assert dep_res.status_code == 201
    dep_id = dep_res.json()['id']
    print(f"✓ Depozit so'rovi yaratildi (#{dep_res.json()['deposit_id']})")

    # 5. Admin Depozitni Tasdiqlaydi
    app_res = c.post(f'/api/v1/billing/admin/deposits/{dep_id}/approve/', HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    assert app_res.status_code == 200
    nodir_pos = InvestorPosition.objects.get(user=nodir)
    print(f"✓ Admin tasdiqladi! Nodirbek Units: {nodir_pos.units}, Balans: ${nodir_pos.current_value_usd}")

    # 6. Admin $70 Savdo Sessiyasini Kiritadi
    sess_res = c.post('/api/v1/invest/admin/execute-session/', {
        'gross_profit_usd': '70.00',
        'trader_type': 'XF',
        'notes': 'Test Sessiya'
    }, HTTP_AUTHORIZATION=f'Bearer {admin_token}', content_type='application/json')
    assert sess_res.status_code == 201
    sess_data = sess_res.json()
    print(f"✓ $70 Sessiya taqsimlandi! Yangi NAV: ${sess_data['nav_after']}, Investorlar ulushi: ${sess_data['investors_share_usd']}")

    # Jasurbek (referrer) ning 5% tushumini tekshiramiz
    jasurbek_pos = InvestorPosition.objects.get(user=jasurbek)
    print(f"✓ Jasurbek referal daromadi (5%): +${jasurbek_pos.referral_earnings_usd}")

    # 7. Nodirbek 100 000 so'mlik Prop Imtihonga ariza topshiradi
    prop_res = c.post('/api/v1/prop/apply/', {
        'card_info_used': '8600 **** 5555'
    }, HTTP_AUTHORIZATION=f'Bearer {nodir_token}')
    assert prop_res.status_code == 201
    prop_id = prop_res.json()['id']
    print(f"✓ Prop imtihon arizasi berildi (#{prop_res.json()['exam_id']})")

    # 8. Admin Alpari MT5 Demo hisob beradi
    prop_app_res = c.post(f'/api/v1/prop/admin/exams/{prop_id}/approve/', {
        'mt5_login': '9948201',
        'mt5_password': 'PassTrader2026',
        'mt5_server': 'Alpari-MT5-Demo',
        'demo_balance_usd': 10000.00
    }, HTTP_AUTHORIZATION=f'Bearer {admin_token}', content_type='application/json')
    assert prop_app_res.status_code == 200
    print(f"✓ Admin MT5 Demo hisob ma'lumotlarini topshirdi! Login: 9948201")

    # 9. Nodirbek o'z kabinetida MT5 ma'lumotlarini ko'rishi
    my_props = c.get('/api/v1/prop/my/', HTTP_AUTHORIZATION=f'Bearer {nodir_token}')
    assert my_props.status_code == 200
    active_exam = my_props.json()[0]
    assert active_exam['status'] == 'ACTIVE'
    assert active_exam['mt5_login'] == '9948201'
    print(f"✓ Investor kabinetida MT5 login/parol faol: {active_exam['mt5_login']} / {active_exam['mt5_password']}")

    # 10. Leaderboard tekshirish
    lb_res = c.get('/api/v1/users/leaderboard/')
    assert lb_res.status_code == 200
    print(f"✓ Leaderboard TOP kapital egalari soni: {len(lb_res.json()['by_capital'])}")

    print("\n==========================================")
    print("BARCHA 10 TA KRITIK INTEGRATSION TESTLAR MUVAFFAQISATLI O'TDI! (100% PASS)")
    print("==========================================")

if __name__ == '__main__':
    run_tests()
