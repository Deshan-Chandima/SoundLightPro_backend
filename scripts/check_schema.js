const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' }); // Load from backend root

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'rental_system'
};

async function checkSchema() {
    console.log(`Checking schema for database: ${dbConfig.database}`);
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [columns] = await connection.query(`SHOW COLUMNS FROM equipment LIKE 'damagedQuantity'`);
        console.log('Columns in equipment table:');
        if (columns.length > 0) columns.forEach(c => console.log(`- ${c.Field} (${c.Type}) Null:${c.Null} Default:${c.Default}`));
        else console.log('❌ damagedQuantity column NOT FOUND');
        await connection.end();
    } catch (error) {
        console.error('Error checking schema:', error.message);
    }
}

checkSchema();
