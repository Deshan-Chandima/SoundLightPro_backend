const { getPool } = require('../config/db');
const Equipment = require('../models/Equipment');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const User = require('../models/User');
const Setting = require('../models/Setting');
const Category = require('../models/Category');
const Expense = require('../models/Expense');

exports.exportBackup = async (req, res) => {
    try {
        const [
            equipment,
            customers,
            orders,
            users,
            settings,
            categories,
            expenses
        ] = await Promise.all([
            Equipment.getAll(),
            Customer.getAll(),
            Order.getAll(),
            User.getAllForBackup(), // Uses the new method to get passwords
            Setting.get(),
            Category.getAll(),
            Expense.getAll()
        ]);

        const backupData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            equipment,
            customers,
            orders,
            users,
            settings: settings || {},
            categories,
            expenses
        };

        res.json(backupData);
    } catch (error) {
        console.error('Export Backup Error:', error);
        res.status(500).json({ message: 'Failed to create backup', error: error.message });
    }
};

exports.importBackup = async (req, res) => {
    const backupData = req.body;

    if (!backupData || typeof backupData !== 'object') {
        return res.status(400).json({ message: 'Invalid backup data' });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Disable foreign key checks to allow truncation/deletion in any order
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Clear existing data
        await connection.query('TRUNCATE TABLE equipment');
        await connection.query('TRUNCATE TABLE customers');
        await connection.query('TRUNCATE TABLE orders');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('TRUNCATE TABLE settings');
        await connection.query('TRUNCATE TABLE categories');
        await connection.query('TRUNCATE TABLE expenses');

        // Restore Categories
        if (backupData.categories && backupData.categories.length > 0) {
            for (const cat of backupData.categories) {
                await connection.query('INSERT INTO categories SET ?', cat);
            }
        }

        // Restore Equipment
        if (backupData.equipment && backupData.equipment.length > 0) {
            for (const item of backupData.equipment) {
                await connection.query('INSERT INTO equipment SET ?', item);
            }
        }

        // Restore Customers
        if (backupData.customers && backupData.customers.length > 0) {
            for (const cust of backupData.customers) {
                await connection.query('INSERT INTO customers SET ?', cust);
            }
        }

        // Restore Users
        if (backupData.users && backupData.users.length > 0) {
            for (const user of backupData.users) {
                // If password isn't hashed (legacy backup assumption), hash it? 
                // For now, assuming backup comes from our system which exports hashes.
                // We just insert as is.

                const userData = { ...user };
                // Map phone to contact if needed
                if (userData.phone && !userData.contact) {
                    userData.contact = userData.phone;
                    delete userData.phone;
                }

                await connection.query('INSERT INTO users SET ?', userData);
            }
        }

        // Restore Settings
        if (backupData.settings) {
            const { companyName, logo, address, email, phone, currency, taxPercentage } = backupData.settings;

            await connection.query(
                `INSERT INTO settings (id, companyName, logo, address, email, phone, currency, taxPercentage) 
                 VALUES (1, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 companyName=VALUES(companyName), logo=VALUES(logo), address=VALUES(address), 
                 email=VALUES(email), phone=VALUES(phone), currency=VALUES(currency), taxPercentage=VALUES(taxPercentage)`,
                [companyName, logo, address, email, phone, currency, taxPercentage]
            );
        }

        // Restore Expenses
        if (backupData.expenses && backupData.expenses.length > 0) {
            for (const exp of backupData.expenses) {
                // Format date if necessary, but assuming ISO string from DB is fine for mysql or date string
                const expData = { ...exp };
                if (expData.date) {
                    expData.date = new Date(expData.date).toISOString().slice(0, 10);
                }
                await connection.query('INSERT INTO expenses SET ?', expData);
            }
        }

        // Restore Orders
        if (backupData.orders && backupData.orders.length > 0) {
            for (const order of backupData.orders) {
                const orderData = { ...order };
                // Ensure items is stringified for storage
                if (typeof orderData.items === 'object') {
                    orderData.items = JSON.stringify(orderData.items);
                }
                // Handle dates
                if (orderData.createdAt) {
                    orderData.createdAt = new Date(orderData.createdAt).toISOString().slice(0, 19).replace('T', ' ');
                }
                // Handle returnDate if exists
                if (orderData.returnDate) {
                    orderData.returnDate = new Date(orderData.returnDate).toISOString().slice(0, 10); // DATE type usually
                }

                await connection.query('INSERT INTO orders SET ?', orderData);
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        await connection.commit();

        res.json({ message: 'Backup restored successfully' });
    } catch (error) {
        await connection.rollback();
        // Ensure checks are re-enabled even on error if connection stays alive (pool)
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.error('Import Backup Error:', error);
        res.status(500).json({ message: 'Failed to restore backup', error: error.message });
    } finally {
        connection.release();
    }
};
