# Homestay Chukai Utama — homestaykemaman

Laman web statik (HTML/CSS/JS) untuk Homestay Chukai Utama, Kemaman, Terengganu.
Hosting: Firebase Hosting. Semua fail laman dalam `public/`.

## Deploy — WAJIB guna --project

```
firebase deploy --only hosting --project homestaykemaman-dbdcc
```

- **JANGAN** deploy tanpa flag `--project`. Pada 11 Jul 2026, alias tersimpan
  dari `firebase use` menyebabkan homestay ter-deploy ke project
  `suratkebenaranko` dan menimpa laman surat kebenaran sekolah.
- Selepas deploy, semak "Hosting URL" dalam output ialah
  `https://homestaykemaman-dbdcc.web.app` sebelum anggap siap.

## URL & akaun

- Live: https://homestaykemaman-dbdcc.web.app
- Firebase project: `homestaykemaman-dbdcc`
- GitHub: https://github.com/msrab1979-ai/homestaykemaman

## Admin & keselamatan

- Admin (`/admin.html`) guna log masuk Google; hanya `msrab1979@gmail.com`.
- `firestore.rules` & `storage.rules`: baca awam, tulis hanya e-mel admin.
  E-mel ini juga dalam `public/js/admin.js` (`ADMIN_EMAIL`) — tukar kedua-dua.
- Deploy rules: `firebase deploy --only hosting,firestore:rules,storage --project homestaykemaman-dbdcc`
- Teks laman (tagline, alamat, kemudahan) ditimpa oleh Firestore `config/homestay`
  semasa runtime — betulkan data di panel admin, bukan HTML sahaja.

## Matlamat & status (25 Nov 2026)

- Matlamat SEO: rank #1 untuk "homestay kemaman", "homestay chukai", "homestay chukai kemaman".
- Rank 25 Nov 2026: "homestay kemaman" hlm 3 · "homestay chukai" hlm 2 ·
  "homestay chukai kemaman" hlm 1 (#9) · "homestay chukai utama" #1. Belum ada dalam Maps.
- Google Business Profile: nama ditukar ke "Homestay Chukai Utama", kategori
  Home Stay (utama) / Guest house / Holiday Home. **Belum verified** — satu-satunya
  kaedah ialah video oleh pemilik. Pemilik akan rakam & upload video.
- Jangan buat ulasan palsu (pemilik pernah minta; ditolak — risiko profil digantung).

## Seterusnya — selepas GBP verified

1. Isi penerangan & kemudahan dalam GBP (medan tersembunyi sebelum verify).
2. Tukar link Maps dalam `public/index.html` (`maps.app.goo.gl/pNFeJoK86tsGzBFq8`,
   hanya koordinat) dan `hasMap` dalam schema kepada link profil sebenar.
3. Tambah butang "Tinggalkan Ulasan" (link ulasan GBP) + reka kad QR A5 untuk dicetak.
4. Menunggu dari pemilik: harga, kapasiti/katil, WiFi/mesin basuh, ulasan sebenar,
   gambar tambahan → kembangkan kandungan laman.
5. Pilihan: domain sendiri (homestaykemaman.com/.my), senarai Booking.com/Agoda.

## Projek berkaitan: appsKO-suratKebenaran

- Lokasi: `/Users/msrab/Desktop/appsKO-suratKebenaran`
- Firebase project: `suratkebenaranko` → https://suratkebenaranko.web.app
- Folder itu TIADA git repo sendiri (git di situ jatuh ke repo home directory) —
  jangan push dari sana.
- Deploy: `firebase deploy --only hosting --project suratkebenaranko`
