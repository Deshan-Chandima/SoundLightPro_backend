const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { dbConfig } = require('../config/db');

async function addContactColumn() {
    let connection;
    try {
        console.log('🔄 Connecting to database...');
        const config = { ...dbConfig };
        // Ensure we connect to the specific database
        console.log(`Using database: ${config.database}`);

        connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');

        console.log('🔄 Adding contact column to users table...');

        try {
            await connection.query('ALTER TABLE users ADD COLUMN contact VARCHAR(50)');
            console.log('✅ Successfully added contact column to users table');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ Column contact already exists');
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

addContactColumn();
