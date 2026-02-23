const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const { testConnection } = require('./config/db');
const initDB = require('./utils/initDB');
const errorHandler = require('./middleware/errorHandler');
const { authenticateJWT } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const equipmentRoutes = require('./routes/equipment');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const expenseRoutes = require('./routes/expenses');
const categoryRoutes = require('./routes/categories');
const settingRoutes = require('./routes/settings');
const backupRoutes = require('./routes/backupRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

app.use('/api/auth', authRoutes);

app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/equipment', authenticateJWT, equipmentRoutes);
app.use('/api/customers', authenticateJWT, customerRoutes);
app.use('/api/orders', authenticateJWT, orderRoutes);
app.use('/api/expenses', authenticateJWT, expenseRoutes);
app.use('/api/categories', authenticateJWT, categoryRoutes);
app.use('/api/settings', authenticateJWT, settingRoutes);
app.use('/api/backup', authenticateJWT, backupRoutes);
app.use('/api/email', authenticateJWT, emailRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        await initDB();

        const isConnected = await testConnection();
        if (!isConnected) {
            console.warn('⚠️  Database connection failed. Please check your database configuration.');
            console.log('💡 Update your .env file with correct MySQL credentials');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API endpoint: http://localhost:${PORT}`);
            console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('═══════════════════════════════════════════════');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
