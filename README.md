# 🎓 EduTech Platform - O'quv Yo'l Xaritasi (Roadmap)

Ushbu loyiha foydalanuvchilarni qobiliyatiga qarab kasbga yo'naltiruvchi va ularga qadam-ba-qadam darslarni (Roadmap) taqdim etuvchi zamonaviy o'quv platformasidir. Loyiha backend va frontend qismlaridan tashkil topgan.

## 🚀 Asosiy Imkoniyatlar

* **Xavfsiz Autentifikatsiya:** JWT token orqali ro'yxatdan o'tish va tizimga kirish.
* **Onboarding Tizimi:** O'quvchining qobiliyatini test orqali aniqlab, unga mos keluvchi yo'nalishni (Dasturlash, Dizayn va h.k.) avtomatik biriktirish.
* **Interaktiv Yo'l Xaritasi (Roadmap):** Darslarni vizual ketma-ketlikda ko'rish va qadam-ba-qadam bajarish.
* **Progressni Kuzatish:** O'quvchining darslarni o'zlashtirish koeffitsientini hisoblash va "O'qib tugatdim" tugmasi orqali natijalarni saqlash.
* **Admin Panel:** Tizimdagi umumiy o'quvchilar va statistikalarni boshqarish (faqat adminlar uchun).

## 💻 Texnologiyalar Steki

**Backend:**
* Python 3.x
* FastAPI (API mantiq va routing)
* PostgreSQL & SQLAlchemy (Ma'lumotlar bazasi va ORM)
* Passlib & Python-jose (Parollarni shifrlash va JWT)

**Frontend:**
* React.js (Vite orqali)
* Tailwind CSS (Dizayn va responsivlik)
* Axios (API so'rovlar)
* React Router DOM (Sahifalar o'rtasida harakatlanish)

## 🛠 Loyihani Ishga Tushirish

### 1. Ma'lumotlar Bazasini Sozlash
Backend papkasi ichida `.env` faylini yarating va PostgreSQL ma'lumotlaringizni kiriting:
```text
DATABASE_URL=postgresql://foydalanuvchi:parol@localhost/baza_nomi
SECRET_KEY=sening_maxfiy_koding
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Backendni Ishga Tushirish

```
cd back
# Virtual muhitni yoqing (agar mavjud bo'lsa)
pip install -r requirments.txt
uvicorn main:app --reload
```
Backend http://localhost:8000 manzilida ishga tushadi. API hujjatlari Swagger orqali http://localhost:8000/docs da mavjud.

### Frontendni Ishga Tushirish

Yangi terminal oching va frontend papkasiga kiring:

```
cd front/front
npm install
npm run dev
```
Veb-sayt http://localhost:5173 manzilida ishga tushadi.