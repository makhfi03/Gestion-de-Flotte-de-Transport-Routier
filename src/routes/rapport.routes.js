const express = require('express');
const router = express.Router();

const rapportController = require('../controllers/rapport.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate, authorize('admin'));

router.get('/consommation', rapportController.getConsommation);
router.get('/kilometrage', rapportController.getKilometrage);
router.get('/maintenance', rapportController.getMaintenance);

module.exports = router;
