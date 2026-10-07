const express = require('express');
const router = express.Router();

const remorqueController = require('../controllers/remorque.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    createRemorqueSchema,
    updateRemorqueSchema
} = require('../validations/remorque.validations');

router.use(authenticate);

router.get('/', remorqueController.getAll);
router.get('/:id', remorqueController.getById);

router.post('/', authorize('admin'), validate(createRemorqueSchema), remorqueController.create);
router.put('/:id', authorize('admin'), validate(updateRemorqueSchema), remorqueController.update);
router.delete('/:id', authorize('admin'), remorqueController.archive);

module.exports = router;