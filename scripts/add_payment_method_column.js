const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

async function addPaymentMethodColumn() {
    let connection;
    try {
        console.log('🔄 Connecting to database...');
        const config = { ...dbConfig };
        console.log(`Using database: ${config.database}`);

        connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');

        console.log('🔄 Adding paymentMethod column to orders table...');

        try {
            await connection.query('ALTER TABLE orders ADD COLUMN paymentMethod VARCHAR(50)');
            console.log('✅ Successfully added paymentMethod column to orders table');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ Column paymentMethod already exists');
            } else {
                throw err;
            }
        }

    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Database connection closed');
        }
    }
}

addPaymentMethodColumn();
