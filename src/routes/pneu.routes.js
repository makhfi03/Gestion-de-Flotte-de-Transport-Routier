const express = require('express');
const router = express.Router();

const pneuController = require('../controllers/pneu.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createPneuSchema,
    updatePneuSchema,
    affecterPneuSchema
} = require('../validations/pneu.validations');

router.use(authenticate);

router.get('/', pneuController.getAll);
router.get('/:id', pneuController.getById);

router.post('/', authorize('admin'), validate(createPneuSchema), pneuController.create);
router.put('/:id', authorize('admin'), validate(updatePneuSchema), pneuController.update);
router.patch('/:id/affecter', authorize('admin'), validate(affecterPneuSchema), pneuController.affecter);
router.delete('/:id', authorize('admin'), pneuController.archive);

module.exports = router;