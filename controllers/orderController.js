const Order = require('../models/Order');

// Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Get order by ID
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Create new order
const createOrder = async (req, res, next) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// Update order
const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.update(req.params.id, req.body);
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// Delete order
const deleteOrder = async (req, res, next) => {
    try {
        await Order.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
