// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'Duplicate entry - Record already exists';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Invalid reference - Related record does not exist';
    } else if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'Database connection failed';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 403;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 403;
        message = 'Token expired';
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
