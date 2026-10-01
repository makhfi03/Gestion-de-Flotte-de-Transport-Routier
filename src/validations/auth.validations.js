const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': "Format d'email invalide",
        'any.required': "L'email est obligatoire"
    }),
    motDePasse: Joi.string().required().messages({
        'any.required': "Le mot de passe est obligatoire"
    })
});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'any.required': "Le refresh token est obligatoire"
    })
});

module.exports = {
    loginSchema,
    refreshTokenSchema
};