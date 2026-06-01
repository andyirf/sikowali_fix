-- Database schema for SIKOWALI (Sistem Konsultasi Wali Murid)
-- Designed for PostgreSQL

-- 1. Student Info Table
CREATE TABLE IF NOT EXISTS student (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  nis VARCHAR(50) NOT NULL
);

-- Seed Student
INSERT INTO student (id, name, class_name, nis) 
VALUES ('20240012', 'Ahmad Budi Santoso', 'Kelas VII-A', '20240012')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, class_name = EXCLUDED.class_name, nis = EXCLUDED.nis;

-- 2. Scores Table
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(100) UNIQUE NOT NULL,
  kkm INT DEFAULT 75,
  tugas INT DEFAULT 0,
  uh1 INT DEFAULT 0,
  uh2 INT DEFAULT 0,
  uts INT DEFAULT 0,
  uas INT DEFAULT 0,
  rata_rata INT DEFAULT 0
);

-- Seed Scores
INSERT INTO scores (subject, kkm, tugas, uh1, uh2, uts, uas, rata_rata) VALUES
('Matematika', 75, 75, 82, 78, 80, 85, 81),
('Bahasa Indonesia', 75, 88, 90, 86, 89, 88, 88),
('IPA', 75, 70, 76, 68, 72, 74, 72),
('IPS', 75, 85, 88, 84, 87, 86, 86),
('Bahasa Inggris', 75, 79, 81, 78, 82, 82, 80),
('Pendidikan Agama', 75, 85, 90, 88, 85, 92, 88),
('PJOK', 75, 80, 85, 82, 85, 88, 84),
('Seni Budaya', 75, 90, 92, 88, 90, 95, 91)
ON CONFLICT (subject) DO UPDATE SET 
  kkm = EXCLUDED.kkm, tugas = EXCLUDED.tugas, uh1 = EXCLUDED.uh1, uh2 = EXCLUDED.uh2, 
  uts = EXCLUDED.uts, uas = EXCLUDED.uas, rata_rata = EXCLUDED.rata_rata;

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  month VARCHAR(50) UNIQUE NOT NULL,
  hadir INT DEFAULT 0,
  sakit INT DEFAULT 0,
  izin INT DEFAULT 0,
  alpha INT DEFAULT 0,
  persentase INT DEFAULT 0
);

-- Seed Attendance
INSERT INTO attendance (month, hadir, sakit, izin, alpha, persentase) VALUES
('Juli', 20, 0, 0, 0, 100),
('Agustus', 18, 1, 1, 0, 90),
('September', 21, 0, 1, 0, 95),
('Oktober', 22, 0, 0, 0, 100),
('November', 19, 1, 0, 1, 90),
('Desember', 13, 2, 0, 0, 86)
ON CONFLICT (month) DO UPDATE SET 
  hadir = EXCLUDED.hadir, sakit = EXCLUDED.sakit, izin = EXCLUDED.izin, 
  alpha = EXCLUDED.alpha, persentase = EXCLUDED.persentase;

-- 4. Behaviour Notes Table
CREATE TABLE IF NOT EXISTS behaviour (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  teacher VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL
);

-- Seed Behaviour
INSERT INTO behaviour (id, type, title, description, teacher, date) VALUES
('b1', 'Positif', 'Aktif bertanya & membantu teman', 'Ahmad aktif bertanya selama pelajaran matematika dan senang membimbing temannya yang kesulitan dalam memahami konsep perkalian aljabar.', 'Pak Wahyu', '2024-11-10'),
('b2', 'Perlu Perhatian', 'Terlambat masuk kelas 10 menit', 'Ahmad terlambat masuk ruang kelas setelah istirahat pertama tanpa keterangan yang jelas.', 'Pak Wahyu', '2024-11-08'),
('b3', 'Prestasi', 'Memenangkan lomba cerdas cermat IPS', 'Berhasil meraih Juara 1 tingkat sekolah dalam Kompetisi Cermat IPS terpadu menyambut Bulan Bahasa.', 'Bu Safitri', '2024-10-25'),
('b4', 'Perlu Perhatian', 'Tidak mengumpulkan PR Matematika', 'Ahmad lupa membawa PR matematika bab persamaan linear. Tugas diserahkan keesokan harinya.', 'Bu Farida', '2024-10-20'),
('b5', 'Positif', 'Menjadi ketua kelompok diskusi dng baik', 'Tampil percaya diri memimpin kelompok dalam praktikum pembuatan laporan ekosistem, mengayomi aspirasi semua anggota regu.', 'Bu Rahma', '2024-10-05')
ON CONFLICT (id) DO UPDATE SET 
  type = EXCLUDED.type, title = EXCLUDED.title, description = EXCLUDED.description, 
  teacher = EXCLUDED.teacher, date = EXCLUDED.date;

-- 5. Student Karya Table
CREATE TABLE IF NOT EXISTS karya (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(512) NOT NULL
);

-- Seed Karya
INSERT INTO karya (id, title, category, date, description, image_url) VALUES
('k1', 'Pameran Seni Budaya', 'Seni Rupa', '2024-11-12', 'Hasil karya miniature patung tanah liat bermotif hewan khas Nusantara milik Ahmad mendapat penilaian istimewa dari dewan guru.', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60'),
('k2', 'Praktikum IPA Ekosistem', 'Sains', '2024-10-15', 'Laporan analisis ekosistem air tawar buatan dalam wadah toples akuaponik mini.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'),
('k3', 'Lomba Cerdas Cermat', 'Sosial', '2024-10-25', 'Foto penyerahan piala Juara 1 lomba cerdas cermat IPS tingkat SMP se-kecamatan.', 'https://images.unsplash.com/photo-1567427018141-058739a21530?w=500&auto=format&fit=crop&q=60'),
('k4', 'Karya Puisi Bahasa Indonesia', 'Sastra', '2024-10-01', 'Puisi indah karangan Ahmad bertema kelestarian hutan alam hujan tropis Indonesia.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, category = EXCLUDED.category, date = EXCLUDED.date, 
  description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 6. Karya Comments Table
CREATE TABLE IF NOT EXISTS karya_comments (
  id SERIAL PRIMARY KEY,
  karya_id VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  CONSTRAINT fk_karya FOREIGN KEY (karya_id) REFERENCES karya(id) ON DELETE CASCADE
);

-- Seed Karya Comments
INSERT INTO karya_comments (id, karya_id, author, text, date) VALUES
(1, 'k1', 'Budi Santoso', 'Wah, bagus sekali bentuknya mas Ahmad!', '2024-11-12'),
(2, 'k1', 'Bu Dian (Guru Seni)', 'Teknik pembenihan tanah liatnya sudah sangat halus dan detail. Teruskan bakat keren ini!', '2024-11-13'),
(3, 'k2', 'Budi Santoso', 'Mantap praktikumnya Nak, sangat ilmiah.', '2024-10-15')
ON CONFLICT (id) DO UPDATE SET 
  karya_id = EXCLUDED.karya_id, author = EXCLUDED.author, text = EXCLUDED.text, date = EXCLUDED.date;

-- Adjust SERIAL sequence for karya_comments
SELECT setval(pg_get_serial_sequence('karya_comments', 'id'), coalesce(max(id), 1)) FROM karya_comments;

-- 7. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  date VARCHAR(50) NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  category VARCHAR(100) NOT NULL
);

-- Seed Announcements
INSERT INTO announcements (id, title, content, author, date, is_important, category) VALUES
('a1', 'Jadwal UTS Semester 2', 'UTS Semester 2 tahun ajaran 2025/2026 akan dilaksanakan secara tertulis pada tanggal 15 - 20 Januari 2025. Harap persiapkan belajar anak-anak dengan giat di rumah. Jadwal mapel lengkap: Senin (IPA, B.Indo), Selasa (MTK, Agama), Rabu (IPS, B.Inggris), Kamis (PJOK, Seni).', 'Kepala Sekolah', '2024-12-01', TRUE, 'Akademik'),
('a2', 'Rapat Wali Murid Rutin', 'Diundang kepada bapak/ibu orang tua murid Kelas VII untuk menghadiri rapat koordinasi perkembangan belajar siswa menyambut ujian akhir. Rapat diselenggarakan hari Sabtu, 14 Desember jam 09:00 WIB di Aula Serbaguna SIKOWALI.', 'Humas Sekolah', '2024-11-28', TRUE, 'Umum'),
('a3', 'Libur Akhir Tahun Ajaran', 'Diberitahukan libur akhir semester ganjil dimulai tanggal 23 Desember 2024 sampai dengan 5 Januari 2025. Kegiatan belajar mengajar semester genap akan aktif kembali pada hari Senin, 6 Januari 2025.', 'Kurikulum', '2024-11-20', FALSE, 'Akademik'),
('a4', 'Pendaftaran Ekskul Semester 2', 'Pendaftaran ekstra kurikuler baru (Fotografi, Coding Club, Robotik, dan Basket) untuk semester genap resmi dibuka mulai 6 - 10 Januari 2025 melalui portal wali murid maupun meja bagian kesiswaan.', 'Pembina OSIS', '2024-11-15', FALSE, 'Kesiswaan')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, content = EXCLUDED.content, author = EXCLUDED.author, 
  date = EXCLUDED.date, is_important = EXCLUDED.is_important, category = EXCLUDED.category;

-- 8. Parenting Articles Table
CREATE TABLE IF NOT EXISTS parenting (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  image_url VARCHAR(512) NOT NULL
);

-- Seed Parenting
INSERT INTO parenting (id, title, category, summary, content, author, image_url) VALUES
('p1', 'Cara Mencegah dan Mengatasi Bullying', 'Keamanan Anak', 'Bullying dapat merusak perkembangan emosional anak secara mendalam. Kenali gejala dini dan pelajari langkah preventif terbaik.', 'Bullying atau perundungan adalah tindakan agresif yang dilakukan dengan sengaja oleh seseorang atau kelompok secara berulang terhadap orang lain yang merasa tidak berdaya. Gejala umum anak yang mengalami perundungan: enggan pergi ke sekolah, kemunduran nilai akademis secara drastis, perubahan pola tidur, atau mendadak murung setelah pulang sekolah. Cara utama mencegah bullying adalah membangun komunikasi terbuka di rumah di mana anak merasa aman bercerita tanpa stigma negatif. Ajarkan juga anak sikap asertif (percaya diri menolak) serta melaporkan insiden kepada wali kelas secepat mungkin.', 'Dra. Setyowati, M.Psi (Psikolog Anak)', 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=60'),
('p2', 'Mendisiplinkan Anak Tanpa Kekerasan', 'Pola Asuh', 'Belajar memahami teknik pembenahan perilaku anak yang konstruktif tanpa melukai fisik maupun melukai rasa percaya diri anak.', 'Mendisiplinkan anak sebaiknya ditargetkan untuk membentuk kebiasaan regulasi diri jangka panjang, bukan sekadar mematuhi perintah karena rasa takut. Penggunaan hukuman fisik dapat meningkatkan hormon stres dan memicu trauma jangka panjang. Gantilah hukuman fisik dengan metode konsekuensi logis. Contohnya, jika anak menolak merapikan mainan, mainan tersebut disimpan sementara waktu. Buat juga kesepakatan tertulis bersama anak mengenai aturan harian untuk menumbuhkan rasa kepemilikan keputusan.', 'Faisal Rahman, S.Psi (Konselor Parenting)', 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=500&auto=format&fit=crop&q=60'),
('p3', 'Mendukung Motivasi Belajar Anak', 'Akademik', 'Strategi memberikan dorongan belajar yang efektif dari lingkungan rumah tanpa memicu stres berlebihan.', 'Motivasi belajar terbaik lahir dari rasa ingin tahu alami (intrinsik), bukan sekadar iming-iming hadiah materi atau ketakutan dimarahi. Orang tua dapat memupuk ini dengan menciptakan ruang belajar yang tenang, bebas gangguan ponsel selama jam belajar, serta mengapresiasi setiap usaha proses ketimbang nilai akhir semata. Ajari anak bahwa kegagalan/nilai buruk adalah bagian penting dari proses adaptasi belajarnya.', 'Hanifah Alatas, M.Pd (Pakar Kurikulum)', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60'),
('p4', 'Komunikasi Efektif Orang Tua-Anak', 'Komunikasi', 'Mendengar aktif dan berempati adalah kunci rahasia meningkatkan kehangatan hubungan orang tua-anak di masa puber.', 'Seringkali percakapan dengan anak terasa satu arah di mana orang tua mendominasi nasehat. Ubah pola ini dengan teknik active listening: dengarkan curhat anak secara penuh tanpa langsung memotong, ulangi kesimpulan perasaannya untuk mengonfirmasi (contoh: ''Oh, jadi kamu merasa kesal karena tugasnya terlalu banyak ya?''), lalu tanyakan saran solusinya daripada langsung mendikte jawaban.', 'Dra. Setyowati, M.Psi (Psikolog Anak)', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, category = EXCLUDED.category, summary = EXCLUDED.summary, 
  content = EXCLUDED.content, author = EXCLUDED.author, image_url = EXCLUDED.image_url;

-- 9. Feedback (Aspirasi) Table
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(50) PRIMARY KEY,
  author VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  likes INT DEFAULT 0
);

-- Seed Feedback
INSERT INTO feedback (id, author, type, content, date, likes) VALUES
('f1', 'Budi Santoso', 'Positif', 'Alhamdulillah pelayanan bapak/ibu guru di SIKOWALI sangat baik dan responsif sekali dalam memonitor tumbuh kembang belajar anak.', '2024-11-10', 8),
('f2', 'Sri Wahyuni', 'Saran', 'Tolong dicarikan solusi untuk jadwal konsultasi guru via video conference online, terkadang kami yang bekerja kantoran kesulitan hadir ke sekolah.', '2024-11-09', 5),
('f3', 'Hendra Pratama', 'Keluhan', 'Fasilitas laboratorium IPA sekolah mohon segera dicek kembali, anak saya bilang ada beberapa mikroskop dan alat ukur praktikum yang lensa maupun sensornya sudah usang/rusak berat.', '2024-11-08', 12),
('f4', 'Yuni Amalia', 'Positif', 'Program seminar online parenting bulanan sangat bermanfaat sekali! Kami jadi lebih memahami emosi anak usia remaja awal.', '2024-11-06', 4),
('f5', 'Dian Rosaline', 'Saran', 'Diharapkan pengumuman detail kisi-kisi UTS bisa diposting lebih cepat di portal ini agar orang tua bisa membimbing anak merangkum latihan materi.', '2024-11-05', 3)
ON CONFLICT (id) DO UPDATE SET 
  author = EXCLUDED.author, type = EXCLUDED.type, content = EXCLUDED.content, 
  date = EXCLUDED.date, likes = EXCLUDED.likes;

-- 10. Feedback Comments Table
CREATE TABLE IF NOT EXISTS feedback_comments (
  id SERIAL PRIMARY KEY,
  feedback_id VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  CONSTRAINT fk_feedback FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
);

-- Seed Feedback Comments
INSERT INTO feedback_comments (id, feedback_id, author, text, date) VALUES
(1, 'f1', 'Humas Sekolah', 'Terima kasih banyak pak Budi, kepuasan wali murid adalah berkah buat guru kami.', '2024-11-10'),
(2, 'f3', 'Sarpras Sekolah', 'Terima kasih pak Hendra atas masukannya. Pembaruan alat laboratorium sudah dianggarkan untuk bulan Desember ini.', '2024-11-09')
ON CONFLICT (id) DO UPDATE SET 
  feedback_id = EXCLUDED.feedback_id, author = EXCLUDED.author, text = EXCLUDED.text, date = EXCLUDED.date;

-- Adjust SERIAL sequence for feedback_comments
SELECT setval(pg_get_serial_sequence('feedback_comments', 'id'), coalesce(max(id), 1)) FROM feedback_comments;

-- 11. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL
);

-- Seed Users
INSERT INTO users (id, username, password, role, name) VALUES
('u1', 'ortu', md5('ortu123'), 'Orang Tua', 'Budi Santoso'),
('u2', 'guru', md5('password123'), 'Guru', 'Bu Safitri'),
('u3', 'admin', md5('password123'), 'Admin', 'Admin Sistem'),
('u4', 'murid', md5('password123'), 'Murid', 'Ahmad Budi S.'),
('u5', 'kepala', md5('password123'), 'Kepala Sekolah', 'Pak Kepala')
ON CONFLICT (id) DO UPDATE SET 
  username = EXCLUDED.username, password = EXCLUDED.password, role = EXCLUDED.role, name = EXCLUDED.name;
