-- SIKOWALI role-aware MySQL/MariaDB schema for phpMyAdmin
-- Import file ini melalui phpMyAdmin bila database belum tersedia.

CREATE DATABASE IF NOT EXISTS `SIKOWALI` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `SIKOWALI`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('orangtua','Guru','kepalasekolah','Admin','Administrator','Murid') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `parent_registrations` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NOT NULL,
  `student_nis` VARCHAR(50) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `class_name` VARCHAR(80) NOT NULL,
  `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` TIMESTAMP NULL,
  `reviewed_by` VARCHAR(50) NULL,
  UNIQUE KEY `uniq_parent_registration_username` (`username`),
  KEY `idx_parent_registration_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `classes` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(80) UNIQUE NOT NULL,
  `homeroom_teacher_id` VARCHAR(50) NULL,
  CONSTRAINT `fk_classes_teacher` FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `class_name` VARCHAR(80) NOT NULL,
  `nis` VARCHAR(50) UNIQUE NOT NULL,
  `parent_name` VARCHAR(150) NULL,
  `parent_id` VARCHAR(50) NULL,
  `user_id` VARCHAR(50) NULL,
  CONSTRAINT `fk_students_parent` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `teachers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `class_name` VARCHAR(80) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `teacher_number` VARCHAR(80) UNIQUE NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `graduate` VARCHAR(150) NOT NULL,
  `address` TEXT NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `user_id` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_teachers_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `student_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `kkm` INT DEFAULT 75,
  `tugas` INT DEFAULT 0,
  `uh1` INT DEFAULT 0,
  `uh2` INT DEFAULT 0,
  `uts` INT DEFAULT 0,
  `uas` INT DEFAULT 0,
  `rata_rata` INT DEFAULT 0,
  UNIQUE KEY `uniq_student_subject` (`student_id`, `subject`),
  CONSTRAINT `fk_student_scores_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `student_attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `month` VARCHAR(50) NOT NULL,
  `hadir` INT DEFAULT 0,
  `sakit` INT DEFAULT 0,
  `izin` INT DEFAULT 0,
  `alpha` INT DEFAULT 0,
  `persentase` INT DEFAULT 0,
  UNIQUE KEY `uniq_student_month` (`student_id`, `month`),
  CONSTRAINT `fk_student_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `student_attendance_daily` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('hadir','sakit','izin','alpha') NOT NULL,
  `note` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_student_date` (`student_id`, `date`),
  CONSTRAINT `fk_student_attendance_daily_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `behaviour` (
  `id` VARCHAR(50) PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `teacher` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `source_portal` VARCHAR(100) NULL,
  CONSTRAINT `fk_behaviour_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `karya` (
  `id` VARCHAR(50) PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(512) NOT NULL,
  CONSTRAINT `fk_karya_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `karya_comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `karya_id` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `text` TEXT NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  CONSTRAINT `fk_karya_comments_karya` FOREIGN KEY (`karya_id`) REFERENCES `karya`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `is_important` BOOLEAN DEFAULT FALSE,
  `category` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(512) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `parenting` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` VARCHAR(50) PRIMARY KEY,
  `author` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `content` TEXT NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `likes` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `feedback_comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `feedback_id` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `text` TEXT NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  CONSTRAINT `fk_feedback_comments_feedback` FOREIGN KEY (`feedback_id`) REFERENCES `feedback`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chatbot_backups` (
  `id` VARCHAR(50) PRIMARY KEY,
  `student_id` VARCHAR(50) NULL,
  `student_name` VARCHAR(150) NULL,
  `user_id` VARCHAR(50) NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `portal` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_chatbot_student` (`student_id`),
  KEY `idx_chatbot_created` (`created_at`),
  CONSTRAINT `fk_chatbot_backup_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `role`, `name`) VALUES
('u_administrator', 'administrator', MD5('password123'), 'Administrator', 'Administrator SIKOWALI'),
('u_admin', 'admin', MD5('password123'), 'Admin', 'Admin SIKOWALI'),
('u_kepala', 'kepala', MD5('password123'), 'kepalasekolah', 'Drs. Kepala Sekolah'),
('u_guru', 'guru', MD5('password123'), 'Guru', 'Ibu Safitri, M.Pd'),
('u_guru2', 'guru2', MD5('password123'), 'Guru', 'Pak Wahyu, S.Pd'),
('u_ortu', 'ortu', MD5('ortu123'), 'orangtua', 'Budi Santoso'),
('u_ortu2', 'ortu2', MD5('ortu123'), 'orangtua', 'Sri Wahyuni'),
('u_murid', 'murid', MD5('password123'), 'Murid', 'Ahmad Budi Santoso'),
('u_murid2', 'murid2', MD5('password123'), 'Murid', 'Nadia Putri Lestari')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `role`=VALUES(`role`);

INSERT INTO `classes` (`id`, `name`, `homeroom_teacher_id`) VALUES
('c_vii_a', 'Kelas VII-A', 'u_guru'),
('c_vii_b', 'Kelas VII-B', 'u_guru2')
ON DUPLICATE KEY UPDATE `homeroom_teacher_id`=VALUES(`homeroom_teacher_id`);

INSERT INTO `students` (`id`, `name`, `class_name`, `nis`, `parent_name`, `parent_id`, `user_id`) VALUES
('20240012', 'Ahmad Budi Santoso', 'Kelas VII-A', '20240012', 'Budi Santoso', 'u_ortu', 'u_murid'),
('20240013', 'Nadia Putri Lestari', 'Kelas VII-A', '20240013', 'Sri Wahyuni', 'u_ortu2', 'u_murid2'),
('20240021', 'Rafi Ramadhan', 'Kelas VII-B', '20240021', 'Sri Wahyuni', 'u_ortu2', NULL)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `class_name`=VALUES(`class_name`), `parent_name`=VALUES(`parent_name`), `parent_id`=VALUES(`parent_id`), `user_id`=VALUES(`user_id`);

INSERT INTO `teachers` (`id`, `name`, `class_name`, `position`, `teacher_number`, `phone`, `graduate`, `address`, `email`, `user_id`) VALUES
('t_guru', 'Ibu Safitri, M.Pd', 'Kelas VII-A', 'Wali Kelas', 'NIG-2024-001', '0812-1000-2001', 'S2 Pendidikan Matematika', 'Jl. Pendidikan No. 1', 'safitri@sikowali.sch.id', 'u_guru'),
('t_guru2', 'Pak Wahyu, S.Pd', 'Kelas VII-B', 'Wali Kelas', 'NIG-2024-002', '0812-1000-2002', 'S1 Pendidikan Bahasa Indonesia', 'Jl. Guru No. 2', 'wahyu@sikowali.sch.id', 'u_guru2')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `class_name`=VALUES(`class_name`), `position`=VALUES(`position`), `phone`=VALUES(`phone`), `graduate`=VALUES(`graduate`), `address`=VALUES(`address`), `email`=VALUES(`email`);

-- Aplikasi akan membuat template nilai dan absensi otomatis untuk murid baru.
-- Akun demo. Password seed disimpan sebagai MD5 legacy dan akan dimigrasi otomatis
-- ke hash PBKDF2 saat login berhasil.
-- Administrator: administrator / password123
-- Admin: admin / password123
-- Kepala Sekolah: kepala / password123
-- Guru wali VII-A: guru / password123
-- Orang tua Ahmad: ortu / ortu123
-- Murid Ahmad: murid / password123
