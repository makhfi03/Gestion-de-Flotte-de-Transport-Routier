const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API v2 opérationnelle' });
});

module.exports = router;