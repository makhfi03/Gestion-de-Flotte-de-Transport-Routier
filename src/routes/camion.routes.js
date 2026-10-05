const express = require('express');
const router = express.Router();

const camionController = require('../controllers/camion.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createCamionSchema,
    updateCamionSchema
} = require('../validations/camion.validations');

router.use(authenticate);

router.get('/', camionController.getAll);
router.get('/:id', camionController.getById);

router.post('/', authorize('admin'), validate(createCamionSchema), camionController.create);
router.put('/:id', authorize('admin'), validate(updateCamionSchema), camionController.update);
router.delete('/:id', authorize('admin'), camionController.archive);

module.exports = router;