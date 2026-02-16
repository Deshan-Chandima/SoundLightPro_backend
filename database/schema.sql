-- SoundLight Pro Rental System Database Schema
-- MySQL Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS rental_system;
USE rental_system;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  pricePerDay DECIMAL(10, 2),
  value DECIMAL(10, 2),
  totalQuantity INT,
  availableQuantity INT,
  damagedQuantity INT DEFAULT 0,
  status ENUM('New', 'Reusable', 'Damaged') DEFAULT 'Reusable',
  description TEXT,
  image TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  trn VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customerId VARCHAR(50),
  customerName VARCHAR(255),
  customerAddress TEXT,
  customerTrn VARCHAR(100),
  items JSON,
  startDate DATE,
  endDate DATE,
  returnDate DATE,
  status VARCHAR(20),
  subtotalAmount DECIMAL(10, 2),
  taxAmount DECIMAL(10, 2),
  discountType VARCHAR(20),
  discountValue DECIMAL(10, 2),
  totalAmount DECIMAL(10, 2),
  advancePayment DECIMAL(10, 2),
  paidAmount DECIMAL(10, 2),
  balanceAmount DECIMAL(10, 2),
  lateFee DECIMAL(10, 2),
  damageFee DECIMAL(10, 2),
  paymentMethod VARCHAR(50),
  notes TEXT,
  createdAt DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(50) PRIMARY KEY,
  orderId VARCHAR(50),
  staffName VARCHAR(255),
  amount DECIMAL(10, 2),
  reason TEXT,
  notes TEXT,
  date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(20),
  contact VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  companyName VARCHAR(255),
  logo TEXT,
  address TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  currency VARCHAR(10),
  taxPercentage DECIMAL(5, 2),
  smtpHost VARCHAR(255),
  smtpPort INT,
  smtpUser VARCHAR(255),
  smtpPass VARCHAR(255),
  smtpFrom VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: eternals)
INSERT IGNORE INTO users (id, username, password, name, email, role, contact)
VALUES ('admin-default', 'akil', '$2a$10$XZYz6ZrKGZQQZQZQZQZQZ.XZYz6ZrKGZQQZQZQZQZQZQZ.XZYz6Zr', 'Akil', 'admin@system.com', 'admin', '0000000000');

-- Note: The server will automatically create tables and default admin on first run
-- This schema file is for reference or manual setup
