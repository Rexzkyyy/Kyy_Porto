# Product Requirements Document (PRD): Integrasi Showcase Produk (Porto-Commerce)

## 1. Tujuan (Objective)
Mengintegrasikan fitur etalase produk digital/fisik ke dalam "Cosmic Portfolio" tanpa mengorbankan identitas profesional. Tujuannya adalah untuk mendemonstrasikan keahlian (Proof of Work) secara langsung sekaligus membuka peluang monetisasi (menjual produk) kepada pengunjung situs, dengan transisi yang mulus antara *showcase* keahlian dan *showcase* produk.

## 2. Konsep Integrasi & Positioning
Agar fitur jualan **tidak mengganggu** citra portofolio, pendekatan yang digunakan adalah:
- **Posisi Halus (Subtle Positioning):** Produk tidak ditampilkan seperti toko online tradisional (e-commerce agresif), melainkan diperlakukan sebagai "Karya Premium" atau "Eksplorasi yang Dapat Dimiliki".
- **Navigasi Simultan:** Bagian produk diletakkan sebagai *section* mandiri di halaman utama (setelah bagian Proyek/Experience) ATAU pada menu navigasi khusus bernama "Digital Assets" / "Products" / "Labs".
- **Desain Selaras:** Menggunakan bahasa desain "Cosmic" yang sama (Glassmorphism, animasi GSAP/Framer Motion, palet warna gelap/Indigo).

## 3. Fitur Utama
1. **Product Grid/Carousel:** Menampilkan daftar produk dengan desain kartu transparan (glassmorphism). Setiap kartu menampilkan:
   - Gambar/Preview Produk
   - Nama Produk
   - Deskripsi Singkat
   - Harga (atau label "Gratis"/"Freemium")
   - Tombol "Lihat Detail" / "Beli"
2. **Detail Modal / Halaman Detail Khusus:** Saat produk diklik, layar tidak berpindah drastis, melainkan membuka *Modal/Popup* layar penuh atau *Drawer* yang elegan agar pengguna tidak merasa keluar dari Portofolio.
3. **Checkout Sederhana (Direct Link):** Karena penjualan masih dirintis, tombol beli akan langsung mengarah ke platform pembayaran pihak ketiga (TipTip, KaryaKarsa, Gumroad, atau integrasi WhatsApp langsung dengan pesan *pre-filled*).
4. **CMS lewat Supabase (Dinamis):** Admin Panel rahasia yang sudah ada akan ditambahkan menu untuk *Create, Read, Update, Delete* (CRUD) produk.

## 4. Spesifikasi UI/UX
- **Tema:** Dark mode (Sesuai dengan `porto-app` saat ini).
- **Animasi Card:** Efek *hover* memunculkan pendaran cahaya (glow effect) di tepi kartu, serupa dengan elemen laser di `PdfThumbnail.tsx`.
- **Tipografi:** Menggunakan font yang sudah ada di proyek untuk konsistensi.

## 5. Struktur Database (Supabase)
Tabel baru: `products`
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `price` (numeric / text, misal: "Rp 50.000")
- `image_url` (text, dari Supabase Storage)
- `checkout_url` (text, link WhatsApp atau payment gateway)
- `is_active` (boolean, untuk menyembunyikan/menampilkan produk)
- `created_at` (timestamp)

## 6. Fase Implementasi (Step-by-Step)
**Fase 1: Persiapan Database (Supabase)**
- Membuat tabel `products`.
- Menyiapkan *bucket* penyimpanan untuk gambar produk.
- Menambahkan *dummy data* untuk keperluan desain.

**Fase 2: Pembuatan Komponen UI (Frontend)**
- `ProductSection.tsx`: Komponen kontainer utama untuk halaman beranda.
- `ProductCard.tsx`: Komponen kartu individual dengan animasi *Framer Motion*.
- `ProductModal.tsx` (Opsional): Tampilan detail saat produk di-klik.

**Fase 3: Integrasi Data**
- Menghubungkan UI dengan Supabase menggunakan fungsi *fetch*.
- Menambahkan status *loading* yang selaras dengan tema kosmik.

**Fase 4: Penyesuaian Dashboard (Admin)**
- Menambahkan formulir di Admin Dashboard agar bisa mengunggah produk baru, mengatur harga, dan memasukkan link pembelian secara mandiri tanpa modifikasi kode.

**Fase 5: Pengujian & Penyempurnaan Animasi**
- Memastikan performa 60 FPS tidak menurun (menggunakan Lenis) saat gambar produk dirender.
- Memastikan *responsiveness* di perangkat seluler.

---
*Dokumen ini adalah cetak biru (blueprint) untuk memulai pengembangan fitur Porto-Commerce secara terstruktur.*
