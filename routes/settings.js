const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
    getSettings,
    saveSettings
} = require('../controllers/settingController');

// GET /api/settings - Get settings
router.get('/', getSettings);

// POST /api/settings - Save settings (admin only)
router.post('/', isAdmin, saveSettings);

module.exports = router;
    