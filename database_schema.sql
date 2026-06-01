-- Database schema for SIKOWALI1 application
-- Generated based on plan (2).md

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS student (
    id VARCHAR(50) PRIMARY KEY,
    name_students VARCHAR(100) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    nis VARCHAR(50) NOT NULL,
    orangtua VARCHAR(50) REFERENCES users(role)
);

CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    name_students VARCHAR(100) NOT NULL,
    subject VARCHAR(100) UNIQUE NOT NULL,
    kkm INT DEFAULT 75,
    tugas INT DEFAULT 0,
    uh1 INT DEFAULT 0,
    uh2 INT DEFAULT 0,
    uts INT DEFAULT 0,
    uas INT DEFAULT 0,
    rata_rata INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    month VARCHAR(50) UNIQUE NOT NULL,
    name_students VARCHAR(100) NOT NULL,
    hadir INT DEFAULT 0,
    sakit INT DEFAULT 0,
    izin INT DEFAULT 0,
    alpha INT DEFAULT 0,
    persentase INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS behaviour (
    id VARCHAR(50) PRIMARY KEY,
    name_students VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    teacher VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS karya (
    id VARCHAR(50) PRIMARY KEY,
    name_students VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS karya_comments (
    id SERIAL PRIMARY KEY,
    karya_id VARCHAR(50) NOT NULL REFERENCES karya(id),
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    date VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    date VARCHAR(50) NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS parenting (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    image_url VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    id VARCHAR(50) PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    likes INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS feedback_comments (
    id SERIAL PRIMARY KEY,
    feedback_id VARCHAR(50) NOT NULL REFERENCES feedback(id),
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    date VARCHAR(50) NOT NULL
);
