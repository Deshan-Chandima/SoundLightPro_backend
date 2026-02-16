const { getPool } = require('../config/db');

class Customer {
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM customers');
        return rows;
    }

    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(customerData) {
        const pool = getPool();
        await pool.query('INSERT INTO customers SET ?', customerData);
        return customerData;
    }

    static async update(id, customerData) {
        const pool = getPool();
        await pool.query('UPDATE customers SET ? WHERE id = ?', [customerData, id]);
        return { id, ...customerData };
    }

    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM customers WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Customer;
