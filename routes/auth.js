const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/authController');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many login attempts, please try again after 15 minutes' }
});

router.post('/login', loginLimiter, login);

module.exports = router;
