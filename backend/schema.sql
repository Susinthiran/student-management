-- Full Stack Student Management System Database Schema
-- Database: student_management

CREATE DATABASE IF NOT EXISTS `student_management` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `student_management`;

-- 1. Users Table (Admin & Staff)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'staff') DEFAULT 'admin',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `credits` INT NOT NULL DEFAULT 3,
  `description` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Students Table
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `dob` DATE NOT NULL,
  `course_id` INT NULL,
  `address` TEXT NOT NULL,
  `admission_date` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_students_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Activity Logs Table (For Dashboard Recent Activities)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `details` VARCHAR(255) NOT NULL,
  `user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_activities_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
-- Default Admin Password: admin123
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'System Administrator', 'admin@sms.edu', '$2a$10$zInfraSrrFnRgHcFvLAgK.GdWaID863TKq33iMwM0MFo5wRRyhPtq', 'admin');

-- Sample Courses
INSERT IGNORE INTO `courses` (`id`, `code`, `name`, `department`, `duration`, `credits`, `description`, `status`) VALUES
(1, 'CS101', 'B.Sc. Computer Science', 'Computer Science & IT', '4 Years', 4, 'Core computing, data structures, algorithms, and web technologies.', 'active'),
(2, 'SE202', 'B.Tech Software Engineering', 'Engineering', '4 Years', 4, 'Software architecture, full-stack development, and DevOps practices.', 'active'),
(3, 'DS303', 'B.Sc. Data Science & AI', 'Data Science', '3 Years', 3, 'Machine learning, predictive modeling, big data, and analytics.', 'active'),
(4, 'BA404', 'Bachelor of Business Administration', 'Management', '3 Years', 3, 'Business economics, finance, marketing, and leadership principles.', 'active'),
(5, 'CY505', 'M.Sc. Cybersecurity & Forensics', 'Cybersecurity', '2 Years', 4, 'Network security, ethical hacking, cryptography, and risk assessment.', 'active');

-- Sample Students
INSERT IGNORE INTO `students` (`id`, `student_id`, `full_name`, `email`, `phone`, `gender`, `dob`, `course_id`, `address`, `admission_date`, `status`) VALUES
(1, 'STU-2024-001', 'Alex Johnson', 'alex.johnson@student.edu', '+1 (555) 234-5678', 'Male', '2003-04-15', 1, '742 Evergreen Terrace, Springfield', '2024-08-15', 'Active'),
(2, 'STU-2024-002', 'Sophia Chen', 'sophia.chen@student.edu', '+1 (555) 345-6789', 'Female', '2002-11-20', 2, '1204 Blossom Hill Rd, San Jose', '2024-08-16', 'Active'),
(3, 'STU-2024-003', 'Marcus Aurelius Williams', 'marcus.w@student.edu', '+1 (555) 456-7890', 'Male', '2001-09-05', 3, '404 Silicon Way, Seattle', '2024-08-18', 'Active'),
(4, 'STU-2024-004', 'Emily Davis', 'emily.davis@student.edu', '+1 (555) 567-8901', 'Female', '2003-01-30', 4, '55 Riverside Ave, Boston', '2024-08-20', 'Inactive'),
(5, 'STU-2024-005', 'Liam Patel', 'liam.patel@student.edu', '+1 (555) 678-9012', 'Male', '2002-07-14', 1, '88 Ocean Boulevard, Miami', '2024-08-22', 'Active'),
(6, 'STU-2024-006', 'Olivia Taylor', 'olivia.t@student.edu', '+1 (555) 789-0123', 'Female', '2003-12-08', 5, '312 Highland Park, Austin', '2024-08-25', 'Suspended');

-- Sample Activity Logs
INSERT IGNORE INTO `activity_logs` (`id`, `action`, `details`, `user_id`) VALUES
(1, 'SYSTEM_INIT', 'System initialized with demo courses and sample student data.', 1),
(2, 'STUDENT_ENROLLED', 'Enrolled new student: Alex Johnson (STU-2024-001)', 1),
(3, 'STUDENT_ENROLLED', 'Enrolled new student: Sophia Chen (STU-2024-002)', 1),
(4, 'COURSE_CREATED', 'New course established: M.Sc. Cybersecurity & Forensics', 1);
