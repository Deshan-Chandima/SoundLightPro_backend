const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'your_password',
    database: process.env.DB_NAME || 'rental_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

const getPool = () => {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
        console.log('✅ MySQL connection pool created');
    }
    return pool;
};

const testConnection = async () => {
    try {
        const connection = await getPool().getConnection();
        console.log('✅ MySQL database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        return false;
    }
};

module.exports = {
    getPool,
    testConnection,
    dbConfig
};
