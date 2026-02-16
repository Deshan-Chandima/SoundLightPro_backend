const Order = require('../models/Order');

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

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

const createOrder = async (req, res, next) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.update(req.params.id, req.body);
        res.json(order);
    } catch (error) {
        next(error);
    }
};

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
