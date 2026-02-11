const { getPool } = require('../config/db');

class Setting {
    // Get current settings
    static async get() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM settings WHERE id = "current"');

        if (rows.length > 0) {
            const config = rows[0].config;
            return typeof config === 'string' ? JSON.parse(config) : config;
        }

        return null;
    }

    // Save settings (insert or update)
    static async save(settingsData) {
        const pool = getPool();
        const config = JSON.stringify(settingsData);

        await pool.query(
            'INSERT INTO settings (id, config) VALUES ("current", ?) ON DUPLICATE KEY UPDATE config = ?',
            [config, config]
        );

        return settingsData;
    }
}

module.exports = Setting;
