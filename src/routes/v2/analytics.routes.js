const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { analyticsLimiter } = require('../../middlewares/rateLimiter.middleware');
const analyticsController = require('../../controllers/analytics.controller');

router.use(authenticate, authorize('admin'), analyticsLimiter);

router.get('/drivers/eco-performance', analyticsController.getEcoPerformance);
router.get('/tires/health-matrix', analyticsController.getTiresHealthMatrix);
router.get('/trips/financial-esg', analyticsController.getFinancialEsgReport);

module.exports = router;