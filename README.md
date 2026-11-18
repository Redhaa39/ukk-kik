# Muhammad Redha Ansori | Portfolio

Portfolio website built with React, Vite, and Tailwind CSS, backed by Supabase
(Postgres + Auth + Storage). Includes public portfolio sections, responsive
navigation, dark/light theme, and a protected admin dashboard.

## Setup Supabase (sekali saja, ±10 menit)

### 1. Buat project

1. Buka [supabase.com](https://supabase.com) dan buat project baru (free tier cukup).
2. Tunggu sampai project selesai disiapkan.

### 2. Buat tabel, RLS, dan storage

1. Buka **SQL Editor** di dashboard Supabase.
2. Copy seluruh isi `supabase/schema.sql` dan **ganti `GANTI_DENGAN_EMAIL_ADMIN`**
   (di blok `do $$ ... $$`) dengan email akun admin dari langkah 3 di bawah.
   Kalau akun admin belum dibuat, kerjakan langkah 3 dulu, baru kembali ke sini.
3. Tempel, lalu klik **Run**.
4. File ini membuat tabel `projects`, `blogs`, `certificates`, `testimonials`,
   `messages`, `admin_users` (daftar admin), bucket Storage `media`, policy
   keamanan, batas kiriman per jam untuk form publik, dan beberapa contoh data.
   Aman dijalankan ulang.

### 3. Buat akun admin

1. Buka **Authentication → Users → Add user**.
2. Isi email dan password, centang **Auto Confirm User**, lalu simpan.
3. Itu akun yang dipakai untuk login di `/admin`. Hanya email yang kamu isi di
   `schema.sql` (tabel `admin_users`) yang dianggap admin; akun Supabase lain
   ditolak oleh RLS dan oleh halaman login.
4. **Matikan sign-up publik**: **Authentication → Sign In / Providers → User
   Signups → Allow new users to sign up = off**. Anon key ada di bundle, jadi
   tanpa ini siapa pun bisa membuat akun. Allow-list di atas tetap jadi lapisan kedua.
5. Admin tambahan: `insert into public.admin_users (user_id) select id from auth.users where email = '...';`

### 4. Hubungkan frontend

1. Buka **Project Settings → API**.
2. Copy **Project URL** dan **anon public key**.
3. Di folder project, copy `.env.example` menjadi `.env.local`:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Isi nilainya:

   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_SITE_URL=https://domain-kamu.com
   ```

   `VITE_SITE_URL` (tanpa slash di akhir) dipakai untuk `og:image` dan canonical
   yang harus berupa URL absolut. Isi juga di environment variables hosting.

5. Restart dev server setelah mengubah `.env.local`.

> Anon key memang aman dipakai di browser. Jangan pernah memakai `service_role`
> key di frontend. Keamanan data dijaga oleh Row Level Security.

### 5. Jalankan

```powershell
npm install
npm run dev
```

Buka `http://localhost:5173` dan admin di `http://localhost:5173/admin`.

Kalau env belum diisi, halaman publik tetap tampil memakai data contoh
("Preview mode") dan admin menampilkan pesan bahwa database belum terhubung.

## Included features

- Portfolio sections: Home, About, Education, Skills, Projects, Certificates,
  Experience, Blog, Testimonials, Contact.
- Project category filtering and database-backed project cards.
- Contact messages and testimonials stored in Supabase.
- Testimonials require admin approval before public display.
- Admin login via Supabase Auth, content CRUD, testimonial moderation, message
  management, and file uploads.
- JPG, PNG, WEBP, and PDF upload support, maximum 5 MB (Supabase Storage).
- Replacing or deleting a project image, blog cover, or certificate file also
  removes the old object from Storage, so the bucket does not collect orphans.
- Projects follow the manual `sort_order` value; other lists show the newest
  entry first.
- Dark/light theme toggle. The admin dashboard always stays dark.
- Public visitors can only read published content and approved testimonials
  (enforced by RLS, not just by the UI).

## Design system

- Font: **Sora** (600/700) untuk heading, **Inter** (400–600) untuk body dan tombol.
- Background: `#09090B` (utama), `#111116` (section alternatif), kartu `#141419`.
- Border: `#27272A`. Aksen: `#6366F1` (utama), `#A5B4FC` (hover/ikon),
  `#A855F7` dan `#22D3EE` (gradien).
- Teks: `#F5F5F5` (judul), `#A1A1AA` (paragraf), `#8B8B95` (label sekunder;
  kontras >= 4.5:1 di atas background gelap, jangan diganti ke `#71717A`).
- Efek glow hanya dipakai di hero, page hero, dan halaman login admin.

Token warna dan font didefinisikan di `src/index.css` lewat `@theme` Tailwind v4,
jadi ganti nilainya di satu tempat kalau ingin menyesuaikan tema.

## Admin dashboard

Buka `/admin`, login dengan akun Supabase Auth. Tab di dashboard: **Proyek**,
**Blog**, **Sertifikat**, **Testimoni**, dan **Pesan**.

- **Tambah** membuat data baru; **Edit** mengubah data; **Hapus** menghapus data.
- Upload gambar/PDF lewat form. Setelah diganti, file lama otomatis dibersihkan.
- **Testimoni** dari pengunjung masuk sebagai `Menunggu`. Klik **Setujui** agar
  tampil di halaman publik, atau **Tolak** untuk menyembunyikannya.
- **Pesan**: **Buka pesan** menampilkan isi lengkap (dan menandainya terbaca),
  **Balas** membuka email ke pengirim, **Tandai belum dibaca** mengembalikan
  statusnya, **Hapus** kalau sudah tidak diperlukan.
- **Blog**: kolom konten mendukung paragraf (pisah baris kosong), `## Judul`,
  daftar `- item`, dan blok kode dengan ``` di baris sendiri.

## Deploy

1. Deploy ke Vercel/Netlify (build command `npm run build`, output `dist`).
2. Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di environment
   variables hosting.
3. SPA rewrite sudah disiapkan: `vercel.json` untuk Vercel dan `public/_redirects`
   untuk Netlify/Cloudflare Pages. Keduanya mengarahkan `/admin`, `/about`, dan
   route lain ke `index.html` supaya tidak 404.
4. Di Supabase **Authentication → URL Configuration**, tambahkan domain hosting
   ke **Site URL** dan **Redirect URLs** agar sesi login admin tetap valid.

## Struktur data

| Tabel | Isi |
| --- | --- |
| `projects` | judul, kategori, deskripsi, problem, solution, role, `technologies text[]`, gambar, link demo/GitHub, publish flag |
| `blogs` | judul, kategori, excerpt, content, cover, tanggal publish |
| `certificates` | judul, organizer, deskripsi, tahun, URL file |
| `testimonials` | nama, rating 1–5, pesan, status `pending/approved/rejected` |
| `messages` | pesan dari form kontak, status dibaca |

## Catatan

- Ganti data placeholder di `src/data/profile.js` (foto, email, URL sosial,
  stats) serta detail pendidikan/pengalaman sebelum publikasi. Cari `TODO`.
- Jangan bagikan zip/folder yang berisi `.env.local`. Anon key memang publik,
  tapi tidak ada alasan menyebarkannya.
- Anti-spam: form punya honeypot, dan database membatasi kiriman per jam
  (lihat `limit_public_inserts` di `schema.sql`). Untuk proteksi lebih kuat
  tambahkan Turnstile atau hCaptcha.
