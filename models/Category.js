const { getPool } = require('../config/db');

class Category {
    // Get all categories
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM categories');
        return rows;
    }

    // Get category by ID
    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    }

    // Create new category
    static async create(categoryData) {
        const pool = getPool();
        await pool.query('INSERT INTO categories SET ?', categoryData);
        return categoryData;
    }

    // Update category
    static async update(id, categoryData) {
        const pool = getPool();
        await pool.query('UPDATE categories SET ? WHERE id = ?', [categoryData, id]);
        return { id, ...categoryData };
    }

    // Delete category
    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Category;
