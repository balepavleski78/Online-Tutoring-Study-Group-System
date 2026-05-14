CREATE DATABASE IF NOT EXISTS tutoring_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE tutoring_system;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','tutor','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tutor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  bio TEXT DEFAULT '',
  expertise VARCHAR(255) DEFAULT '',
  hourly_rate DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tutoring_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tutor_id INT NOT NULL,
  subject_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('open','booked','cancelled') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  INDEX idx_tutor (tutor_id),
  INDEX idx_subject (subject_id),
  INDEX idx_date (date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  slot_id INT NOT NULL UNIQUE,
  status ENUM('requested','approved','rejected','cancelled') NOT NULL DEFAULT 'requested',
  request_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (slot_id) REFERENCES tutoring_slots(id) ON DELETE CASCADE,
  INDEX idx_student (student_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS study_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  subject_id INT NOT NULL,
  created_by INT NOT NULL,
  description TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  location_or_link VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subject_grp (subject_id),
  INDEX idx_creator_grp (created_by)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS group_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  student_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_group_student (group_id, student_id),
  INDEX idx_group (group_id),
  INDEX idx_student_group (student_id)
) ENGINE=InnoDB;
