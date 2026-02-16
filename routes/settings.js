const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
    getSettings,
    saveSettings
} = require('../controllers/settingController');

router.get('/', getSettings);
router.post('/', isAdmin, saveSettings);

module.exports = router;