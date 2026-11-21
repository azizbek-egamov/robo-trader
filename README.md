# 🪙 XORAZM FOREX — XF CopyTrade & Imtihon Platformasi

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0%2B-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> **Xorazm Forex** — Master Account orqali professional treyding, dinamik NAV va Investment Units asosidagi shaffof 50/50 daromad taqsimoti hamda 100 000 so‘mlik saralash imtihoni ekotizimi.

---

## 🏛️ Asosiy Modullar va Imkoniyatlar

1. **Investment Units + Dinamik NAV (Net Asset Value):**
   * Yangi qo‘shilgan investorlar eski investorlarning ishlab topgan foydasiga sherik bo‘lmaydi.
   * Har bir depozit o‘sha lahzadagi NAV qiymati bo‘yicha Units'ga aylanadi.
2. **50/50 Avtomatik Foyda Taqsimoti:**
   * Kunlik daromad (masalan, bugungi `+$70.00`) 50% XF Master Fund va 50% Investorlar o‘rtasida ulushga mutanosib taqsimlanadi.
3. **5% Referal Bonus Mexanizmi:**
   * Taklif qiluvchi (referal egasi) o‘zi taklif qilgan investorning **sof foydasidan 5%** avtomatik oladi (asosiy kapitaldan emas, ishlab topgan foydasidan ushlab o‘tkaziladi).
4. **P2P Karta Depozit va Chek Tekshiruvi:**
   * Investor so‘m kartasiga to‘lov qilib, chek skrinshotini yuklaydi.
   * Admin tekshirib tasdiqlagach, tizim avtomatik ravishda Units hisoblab balansga qo‘shadi.
5. **100 000 so‘mlik Saralash Imtihoni:**
   * Foydalanuvchi 100 000 so‘m to‘lab chek yuklaydi.
   * Admin tekshirib tasdiqlaydi va uning shaxsiy kabinetiga **Alpari MT5 Demo Login, Parol va Server** ma’lumotlarini chiqarib beradi.
6. **Alpari MT5 Investor Paroli Shaffofligi:**
   * Har bir investor o‘z MT5 terminali orqali Sardorbek Vaisovning savdolarini investor paroli orqali jonli tekshirishi mumkin.
7. **Jonli Realtime Aloqa (Django Channels WebSockets):**
   * Admin sessiya kiritishi yoki depozit tasdiqlashi bilan sahifa refreshsiz (F5 siz) darhol yangilanadi.

---

## 🛠️ Texnologik Stek

* **Backend:** Python 3.10+, Django, Django REST Framework (DRF), SimpleJWT, Django Channels, Daphne ASGI, SQLite.
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts.
* **Protokollar:** REST API, WebSocket (`ws://127.0.0.1:8000/ws/trading/`).

---

## 🚀 Yangi Kompyuterda O‘rnatish

To‘liq va batafsil o‘rnatish qo‘llanmasi: **[INSTALLATION.md](INSTALLATION.md)**

### Tezkor qadamlar:

```bash
# 1. Klonlash
git clone https://github.com/azizbek-egamov/robo-trader.git
cd robo-trader

# 2. Backend
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows (yoki source venv/bin/activate Linux/macOS)
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
daphne -b 127.0.0.1 -p 8000 config.asgi:application

# 3. Frontend (Yangi terminalda)
cd frontend
npm install
npm run dev
```

### Windows uchun 1-bosishda ishga tushirish:
```powershell
.\start-dev.ps1
```

---

## 🔑 Dastlabki Kirish Ma’lumotlari

* **Admin:** `+998 97 560 06 00` / `admin123`
* **Test Investor:** `+998 90 111 22 33` / `investor123`

---

## 📜 Litsenziya va Huquqlar

© 2026 XORAZM FOREX. Barcha huquqlar himoyalangan.
Loyiha Ommaviy Oferta shartlariga muvofiq faoliyat yuritadi (`oferta.txt`).
