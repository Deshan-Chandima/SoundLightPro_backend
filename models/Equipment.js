const { getPool } = require('../config/db');

class Equipment {
    // Get all equipment
    static async getAll() {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM equipment');
        return rows;
    }

    // Get equipment by ID
    static async getById(id) {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id]);
        return rows[0];
    }

    // Create new equipment
    static async create(equipmentData) {
        const pool = getPool();
        await pool.query('INSERT INTO equipment SET ?', equipmentData);
        return equipmentData;
    }

    // Update equipment - only update columns that exist in the DB
    static async update(id, equipmentData) {
        const pool = getPool();
        const allowedFields = ['name', 'category', 'pricePerDay', 'value', 'totalQuantity', 'availableQuantity', 'damagedQuantity', 'status', 'description'];
        const updateData = {};
        for (const field of allowedFields) {
            if (equipmentData[field] !== undefined) {
                updateData[field] = equipmentData[field];
            }
        }
        console.log(`Updating equipment ${id} with:`, updateData);
        await pool.query('UPDATE equipment SET ? WHERE id = ?', [updateData, id]);
        return { id, ...equipmentData };
    }

    // Delete equipment
    static async delete(id) {
        const pool = getPool();
        await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
        return { success: true };
    }

    // Update quantity
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
