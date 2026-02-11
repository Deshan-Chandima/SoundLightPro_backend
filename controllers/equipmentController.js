const Equipment = require('../models/Equipment');

// Get all equipment
const getAllEquipment = async (req, res, next) => {
    try {
        const equipment = await Equipment.getAll();
        res.json(equipment);
    } catch (error) {
        next(error);
    }
};

// Get equipment by ID
const getEquipmentById = async (req, res, next) => {
    try {
        const equipment = await Equipment.getById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.json(equipment);
    } catch (error) {
        next(error);
    }
};

// Create new equipment
const createEquipment = async (req, res, next) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Equipment name is required' });
        }

        const equipment = await Equipment.create(req.body);
        res.status(201).json(equipment);
    } catch (error) {
        next(error);
    }
};

// Update equipment
const updateEquipment = async (req, res, next) => {
    try {
        const equipment = await Equipment.update(req.params.id, req.body);
        res.json(equipment);
    } catch (error) {
        next(error);
    }
};

// Delete equipment
const deleteEquipment = async (req, res, next) => {
    try {
        await Equipment.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};
