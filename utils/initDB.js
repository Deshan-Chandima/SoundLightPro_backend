const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { dbConfig } = require('../config/db');

const initDB = async () => {
    try {
        console.log('🔄 Initializing database...');

        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`✅ Database '${dbConfig.database}' ready`);
        await connection.end();

        const pool = mysql.createPool(dbConfig);

        const tables = [
            `CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )`,

            `CREATE TABLE IF NOT EXISTS equipment (
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
      )`,

            `CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        trn VARCHAR(100)
      )`,

            `CREATE TABLE IF NOT EXISTS orders (
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
      )`,

            `CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(50) PRIMARY KEY,
        orderId VARCHAR(50),
        staffName VARCHAR(255),
        amount DECIMAL(10, 2),
        reason TEXT,
        notes TEXT,
        date DATE
      )`,

            `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(20),
        contact VARCHAR(50)
      )`,

            `CREATE TABLE IF NOT EXISTS settings (
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
        smtpFrom VARCHAR(255),
        bankDetails TEXT,
        termsAndConditions TEXT
      )`
        ];

        for (const sql of tables) {
            await pool.query(sql);
        }
        console.log('✅ All tables created/verified successfully');

        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', ['akil']);
        if (users.length === 0) {
            const hashedPassword = await bcrypt.hash('eternals', 10);
            await pool.query(
                'INSERT INTO users (id, username, password, name, email, role, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ['admin-default', 'akil', hashedPassword, 'Akil', 'admin@system.com', 'admin', '0000000000']
            );
            console.log('✅ Default admin user created (username: akil, password: eternals)');
        }

        await pool.end();
        console.log('✅ Database initialization complete!');

    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
};

module.exports = initDB;
