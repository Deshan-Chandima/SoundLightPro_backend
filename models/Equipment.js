const { getPool } = require('../config/db');

class Equipment {
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM equipment');
        return rows;
    }

    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(equipmentData) {
        const pool = getPool();
        await pool.query('INSERT INTO equipment SET ?', equipmentData);
        return equipmentData;
    }

    static async update(id, equipmentData) {
        const pool = getPool();
        const allowedFields = ['name', 'category', 'pricePerDay', 'value', 'totalQuantity', 'availableQuantity', 'damagedQuantity', 'status', 'description', 'image'];
        const updateData = {};
        for (const field of allowedFields) {
            if (equipmentData[field] !== undefined) {
                updateData[field] = equipmentData[field];
            }
        }
        await pool.query('UPDATE equipment SET ? WHERE id = ?', [updateData, id]);
        return { id, ...equipmentData };
    }

    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
        return { success: true };
    }

    static async updateQuantity(id, availableQuantity) {
        const pool = getPool();
        await pool.query(
            'UPDATE equipment SET availableQuantity = ? WHERE id = ?',
            [availableQuantity, id]
        );
        return { success: true };
    }
}

module.exports = Equipment;
