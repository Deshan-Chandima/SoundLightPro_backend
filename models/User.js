const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    // Get all users (without passwords)
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, username, name, email, role, contact FROM users'
        );
        return rows;
    }

    // Get user by ID
    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, username, name, email, role, contact FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Get user by username (with password for authentication)
    static async getByUsername(username) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    // Create new user
    static async create(userData) {
        const pool = getPool();
        const { id, username, password, name, email, role, contact } = userData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (id, username, password, name, email, role, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, username, hashedPassword, name, email, role, contact]
        );

        // Return user without password
        return { id, username, name, email, role, contact };
    }

    // Update user
    static async update(id, userData) {
        const pool = getPool();
        const { password, ...otherData } = userData;

        let updateData = { ...otherData };

        // Hash password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await pool.query('UPDATE users SET ? WHERE id = ?', [updateData, id]);

        // Return updated user without password
        const { password: _, ...userWithoutPassword } = updateData;
        return { id, ...userWithoutPassword };
    }

    // Delete user
    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return { success: true };
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
