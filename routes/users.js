const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// All user routes require authentication (applied in server.js)
// Admin-only routes use isAdmin middleware

// GET /api/users - Get all users (admin only)
router.get('/', isAdmin, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user (admin only)
router.post('/', isAdmin, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
