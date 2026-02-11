const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

async function verifyPaymentMethodColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database');

        // Try to select the paymentMethod column
        await connection.query('SELECT paymentMethod FROM orders LIMIT 1');
        console.log('✅ verification successful: paymentMethod column exists');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

verifyPaymentMethodColumn();
