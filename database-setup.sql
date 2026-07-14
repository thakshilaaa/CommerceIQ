-- CommerceIQ Database Setup Script
-- Run this in MySQL before starting the application

-- Create database
CREATE DATABASE IF NOT EXISTS commerceiq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE commerceiq_db;

-- Create application user (optional — recommended for production)
-- CREATE USER IF NOT EXISTS 'commerceiq_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON commerceiq_db.* TO 'commerceiq_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Note: Hibernate will auto-create all tables on first run (ddl-auto=update).
-- The DataInitializer bean will seed demo users, categories, suppliers, products, and customers.
--
-- Default demo credentials:
--   admin   / admin123   (ROLE_ADMIN)
--   manager / manager123 (ROLE_MANAGER)
--   staff   / staff123   (ROLE_STAFF)

SELECT 'Database setup complete. Start the Spring Boot application to create tables and seed data.' AS message;
