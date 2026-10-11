const express = require('express');
const router = express.Router();

const trajetController = require('../controllers/trajet.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.use(authenticate, authorize('chauffeur'));

router.get('/', trajetController.getMyTrajets);

router.get('/:id', trajetController.getMyTrajetById);

module.exports = router;