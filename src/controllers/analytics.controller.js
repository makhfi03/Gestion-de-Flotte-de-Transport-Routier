const analyticsService = require('../services/analytics.service');

const getEcoPerformance = async (req, res, next) => {
    try {
        const data = await analyticsService.getEcoPerformance();
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEcoPerformance
};