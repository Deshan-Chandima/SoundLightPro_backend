const Customer = require('../models/Customer');

// Get all customers
const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.getAll();
        res.json(customers);
    } catch (error) {
        next(error);
    }
};

// Get customer by ID
const getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.getById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

// Create new customer
const createCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};

// Update customer
const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.update(req.params.id, req.body);
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

// Delete customer
const deleteCustomer = async (req, res, next) => {
    try {
        await Customer.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
