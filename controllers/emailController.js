const { sendEmail } = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

exports.sendInvoiceEmail = async (req, res) => {
    try {
        const { email, orderId, customerName, docType } = req.body;
        const file = req.file;

        if (!email || !file) {
            return res.status(400).json({ message: 'Email and invoice file are required' });
        }

        const Setting = require('../models/Setting');
        const settings = await Setting.get();
        const companyName = settings ? settings.companyName : 'Your Company';
        const type = docType || 'Invoice';

        const subject = `${type} #${orderId} from ${companyName}`;
        const text = `Dear ${customerName},\n\nPlease find attached the ${type.toLowerCase()} for your order #${orderId}.\n\nThank you for your business.`;

        const attachments = [
            {
                filename: file.originalname,
                content: fs.createReadStream(file.path)
            }
        ];

        await sendEmail(email, subject, text, attachments);

        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Invoice sent successfully' });
    } catch (error) {
        console.error('Error in sendInvoiceEmail:', error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};
