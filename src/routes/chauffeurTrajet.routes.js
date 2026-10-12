const express = require('express');
const router = express.Router();

const trajetController = require('../controllers/trajet.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateStatutTrajetSchema, cloturerTrajetSchema } = require('../validations/trajet.validations');

router.use(authenticate, authorize('chauffeur'));

router.get('/', trajetController.getMyTrajets);
router.get('/:id', trajetController.getMyTrajetById);
router.patch('/:id/statut', validate(updateStatutTrajetSchema), trajetController.updateStatut);
router.patch('/:id/cloture', validate(cloturerTrajetSchema), trajetController.cloturer);

module.exports = router;