const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createRegleSchema,
    updateRegleSchema,
    createInterventionSchema
} = require('../validations/maintenance.validations');

router.use(authenticate, authorize('admin'));

router.post('/regles', validate(createRegleSchema), maintenanceController.createRegle);
router.get('/regles', maintenanceController.getAllRegles);
router.get('/regles/:id', maintenanceController.getRegleById);
router.put('/regles/:id', validate(updateRegleSchema), maintenanceController.updateRegle);

router.post('/interventions', validate(createInterventionSchema), maintenanceController.createIntervention);
router.get('/interventions', maintenanceController.getAllInterventions);

module.exports = router;
