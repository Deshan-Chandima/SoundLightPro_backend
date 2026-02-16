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

router.get('/', isAdmin, getAllUsers);
router.get('/:id', getUserById);
router.post('/', isAdmin, createUser);
router.put('/:id', updateUser);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
