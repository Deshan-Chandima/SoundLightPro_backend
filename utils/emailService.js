const nodemailer = require('nodemailer');
const Setting = require('../models/Setting');
require('dotenv').config();

const getTransporter = async () => {
    const settings = await Setting.get();

    if (settings && settings.smtpHost) {
        return nodemailer.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPass
            }
        });
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmail = async (to, subject, text, attachments = []) => {
    try {
        const transporter = await getTransporter();
        const settings = await Setting.get();
        const fromEmail = (settings && settings.smtpFrom) ? settings.smtpFrom : process.env.EMAIL_USER;

        const mailOptions = {
            from: fromEmail,
            to,
            subject,
            text,
            attachments
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
