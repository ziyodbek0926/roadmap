# 🎓 EduTech Platform - O'quv Yo'l Xaritasi (Roadmap)

Ushbu loyiha foydalanuvchilarni qobiliyatiga qarab kasbga yo'naltiruvchi va ularga qadam-ba-qadam darslarni (Roadmap) taqdim etuvchi zamonaviy o'quv platformasidir. Loyiha butunlay qayta ishlanib, `roadmap.sh` va `Duolingo` uslubidagi yumshoq pastel ranglar, yumaloq burchaklar va zamonaviy 3D elementlar bilan boyitildi.

## 🚀 Asosiy Imkoniyatlar

* **Xavfsiz Autentifikatsiya:** Shaffof (glassmorphism) dizayndagi Login va Register formalar, orqa fonda 3D sferalar harakati bilan.
* **Onboarding Tizimi:** O'quvchining qobiliyatini test orqali aniqlab, unga mos keluvchi yo'nalishni avtomatik biriktirish.
* **Interaktiv Yo'l Xaritasi (Roadmap):** Darslarni vizual ketma-ketlikda ko'rish. Kartochkalar va sahifalar `framer-motion` orqali silliq animatsiya qilingan.
* **Progressni Kuzatish:** O'quvchining darslarni o'zlashtirish koeffitsientini hisoblash.
* **Admin Panel (`/admin`):** Faqat admin huquqiga ega foydalanuvchilar kira oladi. Umumiy statistikalar chiroyli kartochkalarda, `recharts` orqali chizilgan bar-chart grafiklarida va zamonaviy jadvallarda namoyish etiladi.
* **Kreativ 404 Sahifa:** Xato ssilkaga kirilganda koinotda adashib qolgan astronavt, yulduzlar (`Stars`) va 3D shakllar aks etgan maxsus sahifa ko'rsatiladi.

## 💻 Texnologiyalar Steki

**Backend:**
* Python 3.x
* FastAPI
* PostgreSQL & SQLAlchemy
* Passlib & Python-jose (Parollarni shifrlash va JWT)

**Frontend:**
* React.js (Vite)
* Tailwind CSS v4 (`@tailwindcss/vite` plagin orqali)
* 3D Vizuallar: `@react-three/fiber`, `@react-three/drei`, `three`
* Animatsiyalar va Xabarnomalar: `framer-motion`, `sonner` (xatolar alert o'rniga zamonaviy pop-up bo'lib chiqadi)
* Global State va API: `zustand`, Axios, `recharts`

## 🛠 Loyihani Ishga Tushirish

### 1. Ma'lumotlar Bazasini Sozlash (Backend)
Backend papkasi ichida `.env` faylini yarating va PostgreSQL ma'lumotlaringizni kiriting:
```text
DATABASE_URL=postgresql://foydalanuvchi:parol@localhost/baza_nomi
SECRET_KEY=sening_maxfiy_koding
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Backendni Ishga Tushirish
```
cd back
pip install -r requirments.txt
uvicorn main:app --reload
```

Backend http://localhost:8000 manzilida ishlaydi.

### 3. Frontendni Ishga Tushirish

Yangi terminal ochib, frontend papkasiga kiring:

```
cd front/front
```
Kerakli kutubxonalarni o'rnating:

```
npm install @react-three/fiber @react-three/drei three framer-motion zustand sonner recharts
npm install -D tailwindcss @tailwindcss/vite
```

(Ixtiyoriy) Agar API manzilingiz boshqa portda ishlasa, front/front/.env faylini ochib quyidagicha sozlang:

```
VITE_API_URL=http://localhost:8001
```
### Dasturni ishga tushiring:

```
npm run dev
```
# 👑 Admin Huquqini Olish

* Admin panelga kirish uchun o'zingizni admin qilib belgilashingiz kerak:

* Oddiy o'quvchi sifatida platformada ro'yxatdan o'ting.

* Backend Swagger sahifasiga (http://localhost:8000/docs) kiring.

* O'z tokeningiz bilan quyidagi so'rovni amalga oshiring:

```
PUT /admin/make-me-admin
Authorization: Bearer <sizning_tokeningiz>
```
* Platformaga qaytadan login qiling. Shaxsiy kabinetingizda "🛠️ Admin Panel" tugmasi paydo bo'ladi.

# ✨ Arxitektura va Mantiq
* API Interceptor: src/lib/api.js faylida Axios sozlamalari markazlashtirilgan. U avtomatik ravishda tokenni yuboradi, 401 xatolik bo'lsa darhol login sahifasiga o'tkazadi va xatoliklarni toast.error orqali ko'rsatadi.

* Global State (Zustand): src/store/useAuthStore.js orqali foydalanuvchi profili faqat bir marta, dastur ochilganda yuklanadi. Har bir sahifada qayta-qayta API so'rov yuborilmaydi.

* Marshrut Himoyasi: Ruxsat etilmagan sahifalarga kirishning oldini olish uchun maxsus ProtectedRoute.jsx va AdminRoute.jsx komponentlari yozilgan.