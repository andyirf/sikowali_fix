# Checklist Produksi SIKOWALI

## Secret dan Environment

- Buat `.env` langsung di server produksi dari `.env.production.example`.
- Isi `NODE_ENV="production"`.
- Isi `APP_URL` dengan domain HTTPS final, bukan localhost.
- Rotate `GEMINI_API_KEY` dari dashboard provider sebelum go-live.
- Jangan commit atau membagikan `.env`.

## Database

- Jangan gunakan user database `root` di production.
- Buat user khusus aplikasi dengan `docs/production_database_user.sql`.
- Ganti password placeholder sebelum menjalankan SQL.
- Pastikan `DB_USER="sikowali_app"` dan `DB_PASSWORD` memakai password kuat.
- Backup database MariaDB sebelum deploy.
- Pastikan tabel `users` sudah berisi akun Administrator yang dibuat secara aman.
- Jangan memakai `SEED_DEFAULT_PASSWORD` di production.

## Server

- Jalankan aplikasi dari process manager, systemd, Docker, cPanel, atau panel hosting.
- Endpoint restart aplikasi otomatis ditolak saat `NODE_ENV=production`.
- Gunakan HTTPS/reverse proxy agar cookie secure aktif.

## Validasi Akhir

- Jalankan `npm run lint`.
- Jalankan `npm run build`.
- Login dengan satu akun valid tiap role.
- Uji refresh halaman tetap mempertahankan session.
- Uji logout menghapus session.
- Uji input data penting: nilai, absensi, murid, data sekolah, dan backup.
