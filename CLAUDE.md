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
- Teks laman (nama, tagline, alamat, kemudahan) ditimpa oleh Firestore `config/homestay`
  semasa runtime — betulkan data di panel admin, bukan HTML sahaja.
- Galeri: 4 gambar sebenar ditulis terus dalam `index.html` (`public/images/`, atribut
  `data-path` = storagePath Firestore). `home.js` hanya MENAMBAH gambar baharu dari
  Firestore. Gambar yang dipadam di admin masih kekal dalam HTML — buang manual.

## Listing Google (Maps / GBP)

- Listing Maps: "homestay kemaman - chukai utama", 4.7★ 60 ulasan (Nov 2026).
  Place ID `ChIJa9pSCe6GyDERv9x8kWgHR5o` · CID `11116862350886231231` ·
  feature `0x31c886ee0952da6b:0x9a470768917cdcbf` (disahkan dengan decode base64).
- GBP dalam akaun msrab1979 ialah listing yang SAMA (claimed, bukan pendua).
  Nama "Homestay Chukai Utama" masih pending — akan tampil selepas verified.
- Link: peta `https://maps.google.com/?cid=11116862350886231231` ·
  tulis ulasan `https://search.google.com/local/writereview?placeid=ChIJa9pSCe6GyDERv9x8kWgHR5o`
- Website dalam listing Maps masih blog lama `homestaychukaiutama.blogspot.com`.
- Pin GBP (4.22356, 103.41770) vs koordinat laman (4.223241, 103.41758) beza ~40 m —
  belum disahkan mana satu pintu rumah sebenar.

## Matlamat & status (25 Nov 2026)

- Matlamat SEO: rank #1 untuk "homestay kemaman" (Search & Maps), juga
  "homestay chukai", "homestay chukai kemaman".
- Rank 25 Nov 2026: "homestay kemaman" hlm 3 · "homestay chukai" hlm 2 ·
  "homestay chukai kemaman" hlm 1 (#9) · "homestay chukai utama" #1.
  Maps "homestay kemaman" (dilihat dari Chukai): **#8** selepas 1 iklan.
- Halaman 1 "homestay kemaman" dikuasai panel "Rumah Inap" Google (dari Booking.com,
  Agoda, Trip.com) + direktori (dhomestay.com, webhomestay.com) — perlu tersenarai di sana.
- GBP **belum verified** — satu-satunya kaedah ialah video oleh pemilik.
- Jangan buat ulasan palsu (pemilik pernah minta; ditolak — risiko profil digantung).
  Akaun msrab1979 sendiri ada ulasan 5★ pada listing ini (konflik kepentingan) —
  disyorkan padam.
- Google Ads kempen "HCU-KMN" aktif tetapi URL iklan ke blog lama, bukan laman ini.
- Blog lama (post 2019) senaraikan "Bengkel Kereta (50 Meter)" di sebelah nombor
  telefon — kemungkinan punca orang call cari mekanik. Disyorkan buang baris itu.
- Fakta kandungan laman (semi-D lot tepi, garaj 4 kereta, katil queen+single tiap
  bilik, meja makan 8, mesin basuh, seterika) diambil dari blog pemilik 2019 —
  pemilik perlu sahkan masih tepat, terutama aircond bilik ketiga & masa check-in.

## Dibuat 25 Nov 2026 (petang)

- GBP (pending verifikasi): nama → "Homestay Chukai Utama Kemaman"; social profile
  Facebook ditambah; website memang sudah laman ini. Kategori Home Stay tiada
  medan waktu operasi; penerangan/atribut tersembunyi sehingga verified.
- GSC: indexing diminta (Google sudah papar snippet baharu). Sitemap dihantar semula;
  status "Couldn't fetch" tetapi Live Test = "URL is available to Google" → tunggu.
- IndexNow (Bing): fail kunci `public/d52bd865da5131ce9feb5c4aeb1f839d.txt`
  (jangan padam). Ping semula selepas kemas kini:
  `https://api.indexnow.org/indexnow?url=<URL>&key=d52bd865da5131ce9feb5c4aeb1f839d`
- Google Ads (akaun 328-848-6488): Final URL iklan HCU-KMN ditukar tetapi Google minta
  "Confirm it's you" — pengguna perlu sahkan sendiri. Iklan 0 impresi 30 hari.
- Blog homestay BUKAN dalam akaun Blogger msrab1979; Facebook tidak log masuk di Chrome.

## Seterusnya

1. Pemilik: rakam video verifikasi GBP (nama & website sudah dikemas kini).
2. Selepas verified: penerangan, waktu operasi, foto baharu, balas 60 ulasan,
   post mingguan; reka kad QR A5 guna link tulis ulasan di atas.
3. Ulasan baharu secara berterusan (tanpa insentif/tapisan) — ulasan terkini lama.
4. Senarai di Booking.com / Agoda / Airbnb (masuk panel "Rumah Inap"), dhomestay.com,
   Bing Places, Apple Business; kemas kini Facebook & jauh.my ke laman ini.
5. Menunggu dari pemilik: harga, kapasiti rasmi, WiFi, gambar tambahan.
6. Pilihan: domain sendiri (homestaykemaman.com/.my).

## Skill SEO

- `.claude/skills/` — 8 skill dari AgriciDaniel/claude-seo (md sahaja, tanpa skrip),
  diimbas dengan NVIDIA SkillSpector. Butiran: `.claude/skills/README-SOURCE.md`.

## Projek berkaitan: appsKO-suratKebenaran

- Lokasi: `/Users/msrab/Desktop/appsKO-suratKebenaran`
- Firebase project: `suratkebenaranko` → https://suratkebenaranko.web.app
- Folder itu TIADA git repo sendiri (git di situ jatuh ke repo home directory) —
  jangan push dari sana.
- Deploy: `firebase deploy --only hosting --project suratkebenaranko`
