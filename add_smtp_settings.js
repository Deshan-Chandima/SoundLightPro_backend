require('dotenv').config();
const { getPool } = require('./config/db');

const migrateSettings = async () => {
    const pool = getPool();
    console.log('Starting migration to add SMTP columns to settings table...');

    try {
        // Check if columns exist
        const [columns] = await pool.query(`SHOW COLUMNS FROM settings LIKE 'smtpHost'`);

        if (columns.length === 0) {
            console.log('Adding SMTP columns...');
            await pool.query(`
                ALTER TABLE settings
                ADD COLUMN smtpHost VARCHAR(255),
                ADD COLUMN smtpPort INT,
                ADD COLUMN smtpUser VARCHAR(255),
                ADD COLUMN smtpPass VARCHAR(255),
                ADD COLUMN smtpFrom VARCHAR(255),
                ADD COLUMN smtpSecure BOOLEAN DEFAULT FALSE
            `);
            console.log('✅ SMTP columns added successfully.');
        } else {
            console.log('ℹ️ SMTP columns already exist.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateSettings();
