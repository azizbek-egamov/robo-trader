# 🚀 XORAZM FOREX — Yangi Kompyuterda O‘rnatish Qo‘llanmasi (Installation Guide)

Ushbu qo‘llanma **XORAZM FOREX (XF CopyTrade & Imtihon)** platformasini yangi kompyuterda (Windows, macOS yoki Linux) noldan to‘liq o‘rnatish va ishga tushirish bosqichlarini o‘z ichiga oladi.

---

## 📋 1. Dastlabki Talablar (Prerequisites)

Kompyuteringizda quyidagi dasturlar o‘rnatilgan bo‘lishi shart:
1. **Python 3.10+** (Tavsiya etiladi: Python 3.11 yoki 3.12).
   * O‘rnatish vaqtida *"Add python.exe to PATH"* katakchasini belgilashni unutmang.
2. **Node.js 18+** (va npm).
3. **Git** (kodni yuklab olish uchun).

---

## 📥 2. Loyihani GitHub'dan Klonlash

Terminal yoki PowerShell ochib, loyihani yuklab oling:
```bash
git clone https://github.com/azizbek-egamov/robo-trader.git
cd robo-trader
```

---

## ⚙️ 3. Backend (Django + Daphne WebSockets) O‘rnatish

### 3.1. Virtual muhit (venv) yaratish va faollashtirish:
* **Windows (PowerShell):**
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\activate
  ```
* **macOS / Linux:**
  ```bash
  cd backend
  python3 -m venv venv
  source venv/bin/activate
  ```

### 3.2. Kutubxonalarni o‘rnatish:
```bash
pip install -r requirements.txt
```

### 3.3. Ma’lumotlar bazasini yaratish (Migrate):
```bash
python manage.py migrate
```

### 3.4. Dastlabki ma’lumotlarni yuklash (Admin, Karta va Test Fund):
Loyihada tayyor seed buyrug‘i mavjud. U admin hisobini, to‘lov kartasini va boshlang‘ich $6 000 lik jamg‘armani yaratadi:
```bash
python manage.py seed_data
```

### 3.5. Backendni ishga tushirish (Daphne WebSockets bilan):
```bash
daphne -b 127.0.0.1 -p 8000 config.asgi:application
```
*(Backend `http://127.0.0.1:8000` manzilida ishlaydi)*.

---

## 🎨 4. Frontend (React + Vite + Tailwind CSS) O‘rnatish

Yangi terminal oynasini oching va frontend papkasiga o‘ting:

```bash
cd frontend
npm install
npm run dev
```
*(Frontend `http://localhost:5173` manzilida ishlaydi)*.

---

## ⚡ 5. Bir Bosishda Ishga Tushirish (Windows uchun)

Har safar ikkita alohida terminal ochmaslik uchun, loyiha ildizida tayyor skript bor:
* Fayl ustiga sichqoncha o‘ng tugmasi bilan bosib **Run with PowerShell** qiling:
  ```powershell
  .\start-dev.ps1
  ```
* Linux / macOS uchun:
  ```bash
  chmod +x start-dev.sh
  ./start-dev.sh
  ```

---

## 🔑 6. Standart Kirish Ma’lumotlari (Credentials)

### A) Boshqaruvchi (Admin):
* **Havola:** `http://localhost:5173/#admin` yoki Navbardagi **Admin** tugmasi
* **Django Native Admin:** `http://127.0.0.1:8000/admin/`
* **Telefon:** `+998 97 560 06 00` (yoki `+998975600600`)
* **Parol:** `admin123`

### B) Test Investorlar:
* **Jasurbek Aliyev:** `+998 90 111 22 33` / `investor123` ($1 000 sarmoya)
* **Otabek Rahimov:** `+998 91 222 33 44` / `investor123` ($2 000 sarmoya)
* **Dilshod Matyoqubov:** `+998 93 333 44 55` / `investor123` ($3 000 sarmoya)

---

## 🧪 7. Integratsion Testlarni Tekshirish

Platformadagi 10 ta eng muhim moliya mexanizmlari (NAV, 50/50 taqsimot, 5% referal chegirma, P2P chek tasdiqlash, Imtihon) to‘g‘ri ishlayotganini sinash uchun:
```bash
cd backend
python test_system.py
```
Natija: `BARCHA 10 TA KRITIK INTEGRATSION TESTLAR MUVAFFAQISATLI O'TDI! (100% PASS)`

---

## ❓ 8. Muammolar va Yechimlar (Troubleshooting)

1. **PowerShell skript ishga tushirishni bloklasa (`Execution Policy`):**
   PowerShell'da bir marta quyidagisini bajaring:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
2. **Port 8000 yoki 5173 band bo‘lsa:**
   Kompyuteringizda ochiq qolgan python yoki node jarayonlarini yoping.
3. **Pillow o‘rnatishda xatolik yuz bersa:**
   Python versiyangiz to‘g‘ri o‘rnatilganligiga va C++ build tools talab qilinmasligiga ishonch hosil qiling (`pip install --upgrade pip` qiling).
