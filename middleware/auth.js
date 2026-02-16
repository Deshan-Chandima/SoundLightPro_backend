const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'soundlight_pro_secret_key_2024';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden - Invalid or expired token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
};

module.exports = {
    authenticateJWT,
    isAdmin
};
