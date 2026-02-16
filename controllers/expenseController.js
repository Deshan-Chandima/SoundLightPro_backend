const Expense = require('../models/Expense');

const getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.getAll();
        res.json(expenses);
    } catch (error) {
        next(error);
    }
};

const getExpenseById = async (req, res, next) => {
    try {
        const expense = await Expense.getById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        next(error);
    }
};

const createExpense = async (req, res, next) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.update(req.params.id, req.body);
        res.json(expense);
    } catch (error) {
        next(error);
    }
};

const deleteExpense = async (req, res, next) => {
    try {
        await Expense.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};
