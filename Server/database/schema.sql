-- ============================================================
-- MERN Course Management System - Database Schema
-- Database: mern_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS mern_db;
USE mern_db;

DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    fees INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    video_expire_days INT NOT NULL DEFAULT 180,
    CHECK (fees >= 0),
    CHECK (end_date >= start_date),
    CHECK (video_expire_days > 0)
);

CREATE TABLE students (
    reg_no INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    mobile_no VARCHAR(10) NOT NULL,
    profile_pic VARCHAR(255),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CHECK (CHAR_LENGTH(mobile_no) = 10)
);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    reg_no INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'active',
        'completed',
        'cancelled'
    ) DEFAULT 'active',

    FOREIGN KEY (reg_no)
        REFERENCES students(reg_no)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (reg_no, course_id)
);

CREATE TABLE videos (
    video_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    youtube_url VARCHAR(255) NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
