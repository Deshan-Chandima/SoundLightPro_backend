const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

// Export Database Backup
router.get('/export', backupController.exportBackup);

// Import Database Backup
router.post('/import', backupController.importBackup);

module.exports = router;
