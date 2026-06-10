# SIKOWALI

SIKOWALI adalah portal sekolah berbasis React + Express dengan koneksi MySQL/MariaDB yang dapat dikelola melalui phpMyAdmin.

## Role Portal

- Murid hanya melihat data dirinya sendiri.
- Orang tua hanya melihat anak yang terhubung dengan akun orang tua tersebut.
- Guru hanya melihat murid pada kelas wali yang ditugaskan dan dapat menambahkan murid di kelasnya.
- Kepala sekolah dapat memilih kelas yang ingin dilihat.
- Admin dapat mengelola user, murid, dan data sekolah lain.

Nilai role pada tabel `users.role`:

```text
orangtua
Guru
kepalasekolah
Admin
Murid
```

## Koneksi Database

Aplikasi membaca koneksi dari file `.env`:

```env
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="sikowali_app"
DB_PASSWORD="ganti_dengan_password_database_yang_kuat"
DB_DATABASE="SIKOWALI_v1"
```

Saat server dijalankan, aplikasi otomatis:

1. Membuat database `SIKOWALI` jika belum ada.
2. Membuat tabel role-aware jika belum ada.
3. Mengisi data demo awal jika tabel masih kosong.

Jika ingin membuat database manual lewat phpMyAdmin, import file:

```text
docs/production_database_user.sql
```

## Catatan Produksi

- Jangan gunakan user database `root` di production.
- Jangan commit file `.env`.
- Buat `.env` produksi dari `.env.production.example`.
- Ikuti checklist di `docs/PRODUCTION_CHECKLIST.md` sebelum go-live.

## Menjalankan dari VS Code di macOS

1. Buka folder proyek ini di VS Code:

```text
/Users/user/Downloads/Andy/Aplikasi/sikowali
```

2. Buka terminal VS Code:

```text
Terminal > New Terminal
```

3. Pastikan terminal berada di folder proyek:

```bash
pwd
```

Output yang benar:

```text
/Users/user/Downloads/Andy/Aplikasi/sikowali
```

4. Pastikan Node.js dan npm tersedia:

```bash
node -v
npm -v
```

Jika `npm: command not found`, install Node.js LTS untuk macOS dari:

```text
https://nodejs.org
```

Tutup dan buka ulang VS Code setelah instalasi agar PATH terminal terbaca.

5. Karena folder `node_modules` saat ini terdeteksi berisi binary `esbuild` untuk Windows, hapus dependency lama lalu install ulang dari macOS:

```bash
rm -rf node_modules package-lock.json
npm install
```

6. Pastikan MySQL/MariaDB aktif. Jika memakai XAMPP/MAMP, nyalakan service MySQL dari panel aplikasinya. Pastikan user/password sesuai `.env`.

7. Jalankan aplikasi:

```bash
npm run dev
```

8. Buka browser:

```text
http://localhost:3000
```

## Perintah Penting

```bash
npm install      # install dependency
npm run dev      # menjalankan server development
npm run lint     # cek TypeScript
npm run build    # build production
npm start        # menjalankan hasil build
```

## Catatan phpMyAdmin

Setelah `npm run dev` berhasil, buka phpMyAdmin dan pilih database `SIKOWALI`. Tabel utama yang dipakai:

- `users`
- `classes`
- `students`
- `teachers`
- `student_scores`
- `student_attendance`
- `behaviour`
- `karya`
- `announcements`
- `parenting`
- `feedback`

Tabel `student_scores` dan `student_attendance` sengaja dipakai agar data nilai/absensi mendukung banyak murid dan tidak bentrok dengan dump lama yang masih single-murid.

Kolom penting:

- `students.parent_name`: nama orang tua yang ditulis saat tambah murid.
- `teachers`: menyimpan nama guru, kelas wali, jabatan, nomor induk guru, nomor kontak, lulusan, alamat, email, dan akun user guru opsional.
