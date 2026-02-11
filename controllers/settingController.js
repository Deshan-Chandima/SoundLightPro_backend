const Setting = require('../models/Setting');

// Get settings
const getSettings = async (req, res, next) => {
    try {
        const settings = await Setting.get();
        if (!settings) {
            return res.json(null);
        }
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// Save settings
const saveSettings = async (req, res, next) => {
    try {
        const settings = await Setting.save(req.body);
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    saveSettings
};
