const express = require('express');
const router = express.Router();

const chauffeurController = require('../controllers/chauffeur.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createChauffeurSchema,
    updateStatutSchema
} = require('../validations/chauffeur.validations');

router.use(authenticate, authorize('admin'));

router.post('/', validate(createChauffeurSchema), chauffeurController.create);

router.get('/', chauffeurController.getAll);

router.get('/:id', chauffeurController.getById);

router.patch('/:id/status', validate(updateStatutSchema), chauffeurController.updateStatus);

module.exports = router;