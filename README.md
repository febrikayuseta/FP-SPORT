# MABAR — Main Bareng, Booking Bareng

Frontend React (Vite) buat platform komunitas olahraga: cari aktivitas, booking slot,
bayar, sampai kelola aktivitas & transaksi lewat panel admin. Dikonek ke REST API
"Sport Reservation" (lihat file Postman collection yang jadi acuan endpoint di sini).

Desainnya sengaja dibikin gaya **neo-brutalist sport brand** — border tebal, bayangan
keras, tipografi condensed besar, warna kontras tinggi (hitam / oranye / lime) — biar
nggak kelihatan kayak template generik.

## Menjalankan

```bash
npm install
cp .env.example .env   # sesuaikan VITE_API_BASE_URL kalau backend-nya nggak di localhost:8000
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Struktur fitur

**Publik**
- `/` — landing page (hero, kategori, aktivitas terbaru)
- `/main` — browse & filter aktivitas (cabang olahraga, kota, kata kunci, pagination)
- `/aktivitas/:id` — detail aktivitas
- `/masuk`, `/daftar` — login & register

**Setelah login**
- `/profil` — lihat & update data akun
- `/aktivitas-saya` — kelola aktivitas yang kamu buat (edit/hapus)
- `/aktivitas-saya/baru`, `/aktivitas-saya/:id/edit` — form bikin/edit aktivitas
- `/booking/:id` — checkout: pilih metode bayar, buat transaksi
- `/transaksi-saya` — riwayat transaksi, upload bukti bayar, batalkan
- `/transaksi/:id` — detail satu transaksi

**Khusus role `admin`**
- `/admin` — ringkasan jumlah kategori/aktivitas/transaksi
- `/admin/kategori` — CRUD kategori olahraga
- `/admin/aktivitas` — moderasi semua aktivitas
- `/admin/transaksi` — verifikasi & ubah status pembayaran

## Soal API — asumsi yang perlu dicek

File Postman collection yang dipakai nggak nyimpen contoh response (semua `"response": []`),
jadi bentuk JSON di bawah ini ditebak dari pola umum Laravel API Resource + script test
di request Login. Kalau backend kamu balikin struktur beda, ini titik yang perlu disesuaikan
(semua ada di folder `src/api/`):

- Semua response dianggap berbentuk `{ success, message, data }`.
- Login/Register: token ada di `data.token` (persis kayak di test script Postman-nya).
  Kalau backend juga balikin object user di `data.user`, langsung kepake; kalau nggak,
  kita fetch ulang lewat `GET /api/v1/me`.
- List yang bisa dipaginate (`is_paginate=true`) dianggap balikin Laravel paginator
  standar (`data.data` = array item, `data.current_page`, `data.last_page`, `data.total`, dst).
  Lihat `normalizeList()` di `src/api/client.js`.
- Upload file/gambar (`/upload-image`, `/upload-file`) dianggap balikin URL di salah satu
  field `data.url` / `data.path` / `data.file_url` / `data.image_url` / `data.location`
  atau `data` string langsung — cek `extractUploadedUrl()` di `src/api/uploads.js` kalau
  ternyata beda.
- Aktivitas (`sport-activities`) dianggap punya relasi ter-embed: `sport_category`,
  `city`, `user` (host). Kalau field-nya dinamai lain (misal `category` bukan
  `sport_category`), sesuaikan di `src/components/ActivityCard.jsx`,
  `src/pages/ActivityDetail.jsx`, dan `src/pages/CreateEditActivity.jsx`.
- Transaksi dianggap punya relasi `sport_activity` dan `payment_method`, plus field
  `status` bernilai `pending` / `success` / `failed` / `cancelled` — mapping label &
  warnanya ada di `src/components/StatusBadge.jsx`.
- Endpoint `GET /sport-activities` belum punya filter "punya saya", jadi halaman
  `Aktivitas Saya` ambil semua aktivitas terus disaring di client berdasarkan
  `user_id`. Kalau datanya banyak banget, sebaiknya minta tim backend nambahin
  parameter filter itu.
- Form edit aktivitas (`CreateEditActivity`) coba nebak provinsi awal dari
  `activity.city.province_id` biar dropdown kota ke-preselect. Kalau field
  `city` yang ke-embed di response aktivitas nggak nyertain `province_id`,
  dropdown provinsi bakal kosong pas edit (city_id lama tetep kesimpen &
  ke-submit bener, cuma nama kotanya nggak langsung kelihatan sampai provinsi
  dipilih ulang).

## Dependensi

Sengaja diminimalin: cuma `react`, `react-dom`, `react-router-dom` + Vite. Semua ikon
di `src/components/Icons.jsx` custom inline SVG (bukan icon pack pihak ketiga) biar
tampilannya khas sendiri.
