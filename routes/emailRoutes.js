const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/send-invoice', upload.single('invoice'), emailController.sendInvoiceEmail);

module.exports = router;
