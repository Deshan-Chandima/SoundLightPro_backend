const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

const checkSettings = async () => {
    let connection;
    try {
        console.log('🔍 Checking Settings Table...');
        connection = await mysql.createConnection(dbConfig);
        const [columns] = await connection.query(`SHOW COLUMNS FROM settings`);
        const fields = columns.map(c => c.Field);
        console.log('Current Columns:', fields.join(', '));

        if (fields.includes('config')) {
            console.log('✅ TYPE: JSON Config (Current Backend)');
        } else if (fields.includes('companyName')) {
            console.log('⚠️ TYPE: Individual Columns (Target Frontend)');
        } else {
            console.log('❓ TYPE: Unknown');
        }

    } catch (error) {
        console.error('❌ Check failed:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkSettings();
