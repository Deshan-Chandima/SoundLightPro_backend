const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/authController');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: { error: 'Too many login attempts, please try again after 15 minutes' }
});

// POST /api/login
router.post('/login', loginLimiter, login);

module.exports = router;
