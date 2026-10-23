const analyticsService = require('../services/analytics.service');
const tiresAnalyticsService = require('../services/tiresAnalytics.service');
const financialEsgService = require('../services/financialEsg.service');

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

const getTiresHealthMatrix = async (req, res, next) => {
    try {
        const data = await tiresAnalyticsService.getTiresHealthMatrix();
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getFinancialEsgReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await financialEsgService.getFinancialEsgReport(startDate, endDate);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEcoPerformance,
    getTiresHealthMatrix,
    getFinancialEsgReport
};