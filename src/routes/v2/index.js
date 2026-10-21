const express = require('express');
const router = express.Router();

const analyticsRoutes = require('./analytics.routes');

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API v2 opérationnelle' });
});

router.use('/analytics', analyticsRoutes);

module.exports = router;