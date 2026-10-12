const express = require('express');
const router = express.Router();

const trajetController = require('../controllers/trajet.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateStatutTrajetSchema } = require('../validations/trajet.validations');

router.use(authenticate, authorize('chauffeur'));

router.get('/', trajetController.getMyTrajets);
router.get('/:id', trajetController.getMyTrajetById);
router.patch('/:id/statut', validate(updateStatutTrajetSchema), trajetController.updateStatut);

module.exports = router;