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

        const { companyName, logo, address, email, phone, currency, taxPercentage } = settingsData;

        // Check if settings exist
        const [rows] = await pool.query('SELECT id FROM settings WHERE id = 1');

        if (rows.length > 0) {
            await pool.query(
                'UPDATE settings SET companyName=?, logo=?, address=?, email=?, phone=?, currency=?, taxPercentage=? WHERE id=1',
                [companyName, logo, address, email, phone, currency, taxPercentage]
            );
        } else {
            await pool.query(
                'INSERT INTO settings (id, companyName, logo, address, email, phone, currency, taxPercentage) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
                [companyName, logo, address, email, phone, currency, taxPercentage]
            );
        }

        return { id: 1, ...settingsData };
    }
}

module.exports = Setting;
