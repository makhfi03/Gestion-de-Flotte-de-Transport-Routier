const express = require('express');
const router = express.Router();

const trajetController = require('../controllers/trajet.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createTrajetSchema,
    assignerTrajetSchema,
    updateStatutTrajetSchema,
    cloturerTrajetSchema
} = require('../validations/trajet.validations');

router.use(authenticate);

router.get('/', trajetController.getAll);
router.get('/:id', trajetController.getById);

router.post('/', authorize('admin'), validate(createTrajetSchema), trajetController.create);
router.put('/:id/assigner', authorize('admin'), validate(assignerTrajetSchema), trajetController.assigner);
router.patch('/:id/statut', authorize('admin', 'chauffeur'), validate(updateStatutTrajetSchema), trajetController.updateStatut);
router.patch('/:id/cloture', authorize('admin', 'chauffeur'), validate(cloturerTrajetSchema), trajetController.cloturer);

module.exports = router;