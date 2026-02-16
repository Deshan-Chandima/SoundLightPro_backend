const { getPool } = require('../config/db');

class Order {
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');

        const parsed = rows.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));

        return parsed;
    }

    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);

        if (rows.length > 0) {
            const order = rows[0];
            order.items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            return order;
        }

        return null;
    }

    static async create(orderData) {
        const pool = getPool();

        const dataToInsert = {
            ...orderData,
            items: JSON.stringify(orderData.items),
            createdAt: orderData.createdAt ? new Date(orderData.createdAt).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        try {
            await pool.query('INSERT INTO orders SET ?', dataToInsert);
        } catch (error) {
            console.error("Database Insert Error:", error);
            throw error;
        }
        return orderData;
    }

    static async update(id, orderData) {
        const pool = getPool();

        const { id: _id, createdAt, ...dataToUpdate } = { ...orderData };
        if (dataToUpdate.items) {
            dataToUpdate.items = JSON.stringify(dataToUpdate.items);
        }

        await pool.query('UPDATE orders SET ? WHERE id = ?', [dataToUpdate, id]);
        return { id, ...orderData };
    }

    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Order;
