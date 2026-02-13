const { getPool } = require('../config/db');

class Setting {
    // Get current settings
    static async get() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');

        if (rows.length > 0) {
            return rows[0];
        }

        return null;
    }

    // Save settings (insert or update)
    static async save(settingsData) {
        const pool = getPool();

        const { companyName, logo, address, email, phone, currency, taxPercentage, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = settingsData;

        // Check if settings exist
        const [rows] = await pool.query('SELECT id FROM settings WHERE id = 1');

        if (rows.length > 0) {
            await pool.query(
                'UPDATE settings SET companyName=?, logo=?, address=?, email=?, phone=?, currency=?, taxPercentage=?, smtpHost=?, smtpPort=?, smtpUser=?, smtpPass=?, smtpFrom=? WHERE id=1',
                [companyName, logo, address, email, phone, currency, taxPercentage, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom]
            );
        } else {
            await pool.query(
                'INSERT INTO settings (id, companyName, logo, address, email, phone, currency, taxPercentage, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [companyName, logo, address, email, phone, currency, taxPercentage, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom]
            );
        }

        return { id: 1, ...settingsData };
    }
}

module.exports = Setting;
