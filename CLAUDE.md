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

## Matlamat & status (hibernate 11 Jul 2026)

- Matlamat SEO: rank #1 untuk carian "homestay kemaman".
- Blocker utama: Google Business Profile belum verified — ini kerja luar kod.
- Laman live dengan title/meta SEO penuh, sitemap.xml dan robots.txt terkini.
- Tiada kerja kod tergantung; projek selamat ditinggalkan dan disambung bila-bila.

## Projek berkaitan: appsKO-suratKebenaran

- Lokasi: `/Users/msrab/Desktop/appsKO-suratKebenaran`
- Firebase project: `suratkebenaranko` → https://suratkebenaranko.web.app
- Folder itu TIADA git repo sendiri (git di situ jatuh ke repo home directory) —
  jangan push dari sana.
- Deploy: `firebase deploy --only hosting --project suratkebenaranko`
