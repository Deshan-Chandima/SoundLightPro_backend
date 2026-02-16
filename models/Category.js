const { getPool } = require('../config/db');

class Category {
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM categories');
        return rows;
    }

    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(categoryData) {
        const pool = getPool();
        await pool.query('INSERT INTO categories SET ?', categoryData);
        return categoryData;
    }

    static async update(id, categoryData) {
        const pool = getPool();
        await pool.query('UPDATE categories SET ? WHERE id = ?', [categoryData, id]);
        return { id, ...categoryData };
    }

    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Category;
