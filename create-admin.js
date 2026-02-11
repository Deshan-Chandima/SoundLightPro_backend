// Simple script to create the default admin user
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createDefaultUser() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'rental_system'
        });

        console.log('Connected to database');

        // Check if user exists
        const [existing] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            ['akil']
        );

        if (existing.length > 0) {
            console.log('User already exists. Deleting old user...');
            await connection.query('DELETE FROM users WHERE username = ?', ['akil']);
        }

        // Create new user
        const hashedPassword = await bcrypt.hash('eternals', 10);
        await connection.query(
            'INSERT INTO users (id, username, password, name, email, role, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['admin-default', 'akil', hashedPassword, 'Akil', 'admin@system.com', 'admin', '0000000000']
        );

        console.log('✅ Default admin user created successfully');
        console.log('Username: akil');
        console.log('Password: eternals');

        // Verify the user
        const [user] = await connection.query(
            'SELECT id, username, name, role FROM users WHERE username = ?',
            ['akil']
        );
        console.log('User in database:', user[0]);

        await connection.end();
        console.log('✅ Done');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createDefaultUser();
