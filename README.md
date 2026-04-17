# 🌌 Cosmic Portfolio | Ikhsanuddin Rezki

Portfolio website masa depan yang dibangun dengan fokus pada performa tinggi, estetika sinematik, dan pengalaman pengguna yang mulus. Proyek ini menggunakan arsitektur modern untuk memastikan kecepatan (60fps) dan kemudahan pengelolaan konten melalui Supabase.

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Fitur Utama

- **🚀 60 FPS Smooth Scrolling**: Menggunakan Lenis Smooth Scroll dan GSAP untuk pengalaman navigasi yang sinematik.
- **🎨 Cinematic Aesthetic**: Desain berbasis "Dark Matter" dengan efek glassmorphism, floating particles, dan animasi premium.
- **🛠️ Admin Dashboard**: Panel manajemen konten terintegrasi untuk mengelola projects, skills, dan pengalaman secara real-time.
- **📱 Responsive & PWA Ready**: Optimal di semua ukuran layar, dari smartphone hingga desktop ultra-wide.
- **⚡ Performance Optimized**: Lazy loading komponen berat, code splitting, dan minimal initial bundle size.

---

## 🛠️ Stack Teknologi

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Micro-animations)
- **Animation**: GSAP + Typed.js (Hero section) + React-TSParticles
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite (Production optimized)

---

## 💻 Cara Menjalankan Secara Lokal

### 1. Clone Repository
```bash
git clone https://github.com/Rexzkyyy/Kyy_Porto.git
cd porto-app
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root directory dan masukkan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

---

## 🌐 Deployment (Vercel)

Proyek ini siap untuk dideploy ke [Vercel](https://vercel.com/):
1. Push kode Anda ke GitHub.
2. Hubungkan repository di Vercel Dashboard.
3. Tambahkan environment variables (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`) di menu Settings Vercel.
4. Klik **Deploy**!

---

## 📄 Lisensi
Dibuat dengan ❤️ oleh **Ikhsanuddin Rezki**. Bebas digunakan untuk referensi pembelajaran.
