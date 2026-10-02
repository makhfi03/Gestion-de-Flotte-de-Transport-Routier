const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema, refreshTokenSchema } = require('../validations/auth.validations');

router.post('/login', validate(loginSchema), authController.login);

router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

router.post('/logout', authController.logout);

module.exports = router;