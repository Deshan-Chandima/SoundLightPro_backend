const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'rental_system'
};

async function migrateUsers() {
    console.log('🔄 Checking users table schema...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [columns] = await connection.query(`SHOW COLUMNS FROM users`);

        const hasPhone = columns.some(c => c.Field === 'phone');
        const hasContact = columns.some(c => c.Field === 'contact');

        if (hasPhone && !hasContact) {
            console.log('⚠️ Found "phone" column but missing "contact". Migrating...');
            // Check if there is data in phone
            // Rename column
            await connection.query('ALTER TABLE users CHANGE phone contact VARCHAR(50)');
            console.log('✅ Successfully renamed "phone" to "contact".');
        } else if (hasPhone && hasContact) {
            console.log('⚠️ Both "phone" and "contact" exist. Merging data and dropping "phone"...');
            // Copy phone to contact where contact is empty
            await connection.query('UPDATE users SET contact = phone WHERE (contact IS NULL OR contact = "") AND phone IS NOT NULL');
            console.log('✅ Data merged.');

            // Drop phone column
            await connection.query('ALTER TABLE users DROP COLUMN phone');
            console.log('✅ Dropped "phone" column.');
        } else if (!hasPhone && hasContact) {
            console.log('✅ Schema is already correct ("contact" column exists).');
        } else {
            console.log('❌ Neither "phone" nor "contact" column found!');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateUsers();
