const { getPool } = require('../config/db');

class Expense {
    // Get all expenses
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM expenses');
        return rows;
    }

    // Get expense by ID
    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);
        return rows[0];
    }

    // Create new expense
    static async create(expenseData) {
        const pool = getPool();
        await pool.query('INSERT INTO expenses SET ?', expenseData);
        return expenseData;
    }

    // Update expense
    static async update(id, expenseData) {
        const pool = getPool();
        await pool.query('UPDATE expenses SET ? WHERE id = ?', [expenseData, id]);
        return { id, ...expenseData };
    }

    // Delete expense
    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Expense;
