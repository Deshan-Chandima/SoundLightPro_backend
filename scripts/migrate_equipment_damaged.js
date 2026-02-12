const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'rental_system'
};

async function migrateEquipment() {
    console.log('🔄 Checking equipment table schema...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [columns] = await connection.query(`SHOW COLUMNS FROM equipment`);

        const hasDamaged = columns.some(c => c.Field === 'damagedQuantity');

        if (!hasDamaged) {
            console.log('⚠️ Missing "damagedQuantity" column. Adding it...');
            await connection.query('ALTER TABLE equipment ADD COLUMN damagedQuantity INT DEFAULT 0 AFTER availableQuantity');
            console.log('✅ Successfully added "damagedQuantity" column.');
        } else {
            console.log('✅ Schema is correct ("damagedQuantity" column exists).');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateEquipment();
