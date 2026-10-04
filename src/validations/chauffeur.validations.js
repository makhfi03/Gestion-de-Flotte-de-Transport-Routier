const Joi = require('joi');

const createChauffeurSchema = Joi.object({
    nom: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Le nom est obligatoire.',
        'string.min': 'Le nom doit contenir au moins 2 caractères.',
        'any.required': 'Le nom est obligatoire.'
    }),
    prenom: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Le prénom est obligatoire.',
        'string.min': 'Le prénom doit contenir au moins 2 caractères.',
        'any.required': 'Le prénom est obligatoire.'
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.email': "Format d'email invalide.",
        'string.empty': "L'email est obligatoire.",
        'any.required': "L'email est obligatoire."
    }),
    motDePasse: Joi.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
        'string.empty': 'Le mot de passe est obligatoire.',
        'any.required': 'Le mot de passe est obligatoire.'
    }),
    telephone: Joi.string().trim().allow('', null).optional()
});

const updateStatutSchema = Joi.object({
    statut: Joi.string().valid('actif', 'suspendu').required().messages({
        'any.only': 'Le statut doit être soit "actif" soit "suspendu".',
        'string.empty': 'Le statut est obligatoire.',
        'any.required': 'Le statut est obligatoire.'
    })
});

module.exports = {
    createChauffeurSchema,
    updateStatutSchema
};