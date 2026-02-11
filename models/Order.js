const { getPool } = require('../config/db');

class Order {
    // Get all orders
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');

        // Parse JSON items field
        const parsed = rows.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
        }));

        return parsed;
    }

    // Get order by ID
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

    // Create new order
    static async create(orderData) {
        const pool = getPool();

        // Convert items array to JSON string
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
        return orderData; // Return original with items as array
    }

    // Update order
    static async update(id, orderData) {
        const pool = getPool();

        // Convert items array to JSON string if present
        const dataToUpdate = { ...orderData };
        if (dataToUpdate.items) {
            dataToUpdate.items = JSON.stringify(dataToUpdate.items);
        }

        await pool.query('UPDATE orders SET ? WHERE id = ?', [dataToUpdate, id]);
        return { id, ...orderData }; // Return original with items as array
    }

    // Delete order
    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        return { success: true };
    }
}

module.exports = Order;
