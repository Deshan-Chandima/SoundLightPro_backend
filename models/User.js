const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, username, name, email, role, contact FROM users'
        );
        return rows;
    }

    static async getAllForBackup() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    }

    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, username, name, email, role, contact FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async getByUsername(username) {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async create(userData) {
        const pool = getPool();
        const { id, username, password, name, email, role, contact } = userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (id, username, password, name, email, role, contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, username, hashedPassword, name, email, role, contact]
        );

        return { id, username, name, email, role, contact };
    }

    static async update(id, userData) {
        const pool = getPool();
        const { password, ...otherData } = userData;

        let updateData = { ...otherData };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await pool.query('UPDATE users SET ? WHERE id = ?', [updateData, id]);

        const { password: _, ...userWithoutPassword } = updateData;
        return { id, ...userWithoutPassword };
    }

    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return { success: true };
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
