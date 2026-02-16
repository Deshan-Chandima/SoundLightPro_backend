const Setting = require('../models/Setting');

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
