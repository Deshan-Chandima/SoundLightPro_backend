const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage

router.post('/send-invoice', upload.single('invoice'), emailController.sendInvoiceEmail);

module.exports = router;
