const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

async function verifyColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Try to select the contact column
        const [rows] = await connection.query('SELECT contact FROM users LIMIT 1');
        console.log('✅ verification successful: contact column exists');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

verifyColumn();
