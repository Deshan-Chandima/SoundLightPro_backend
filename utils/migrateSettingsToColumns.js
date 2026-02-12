const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

const migrateSettings = async () => {
    let connection;
    try {
        console.log('🔄 Starting Settings Migration (JSON -> Columns)...');
        connection = await mysql.createConnection(dbConfig);

        // 1. Fetch existing settings (if any)
        console.log('📥 Fetching current settings...');
        let currentSettings = {};
        try {
            const [rows] = await connection.query('SELECT config FROM settings');
            if (rows.length > 0 && rows[0].config) {
                const config = rows[0].config;
                currentSettings = typeof config === 'string' ? JSON.parse(config) : config;
                console.log('✅ Found existing settings:', currentSettings);
            }
        } catch (e) {
            console.log('⚠️ Could not read old settings (table might not exist or schema diff). Proceeding...');
        }

        // 2. Drop old table
        console.log('🗑️ Dropping old settings table...');
        await connection.query('DROP TABLE IF EXISTS settings');

        // 3. Create new table
        console.log('✨ Creating new settings table (Schema: Columns)...');
        await connection.query(`
            CREATE TABLE settings (
                id INT PRIMARY KEY DEFAULT 1,
                companyName VARCHAR(255),
                logo TEXT,
                address TEXT,
                email VARCHAR(255),
                phone VARCHAR(50),
                currency VARCHAR(10),
                taxPercentage DECIMAL(5, 2)
            )
        `);

        // 4. Insert data back
        if (Object.keys(currentSettings).length > 0) {
            console.log('📤 Restoring settings data...');
            const { companyName, logo, address, email, phone, currency, taxPercentage } = currentSettings;
            await connection.query(
                `INSERT INTO settings (id, companyName, logo, address, email, phone, currency, taxPercentage) 
                 VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
                [companyName, logo, address, email, phone, currency, taxPercentage || 5]
            );
            console.log('✅ Data restored.');
        } else {
            // Insert Defaults if empty
            console.log('⚠️ No existing data found. Inserting defaults.');
            await connection.query(
                `INSERT INTO settings (id, companyName, address, email, phone, currency, taxPercentage) 
                 VALUES (1, 'SoundLight Pro', '123 Event Lane', 'contact@soundlightpro.com', '+1234567890', '$', 5)`
            );
        }

        console.log('🎉 Migration Complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
};

migrateSettings();
