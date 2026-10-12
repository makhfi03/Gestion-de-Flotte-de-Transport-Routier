const Joi = require('joi');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createRegleSchema = Joi.object({
    nom: Joi.string().trim().required().messages({
        'string.empty': 'Le nom de la règle est obligatoire.',
        'any.required': 'Le nom de la règle est obligatoire.'
    }),
    type: Joi.string().valid('vidange', 'revision_technique', 'autre').required().messages({
        'any.only': 'Le type doit être "vidange", "revision_technique" ou "autre".',
        'any.required': 'Le type de maintenance est obligatoire.'
    }),
    seuilKm: Joi.number().positive().required().messages({
        'number.base': 'Le seuil kilométrique doit être un nombre.',
        'number.positive': 'Le seuil kilométrique doit être supérieur à zéro.',
        'any.required': 'Le seuil kilométrique est obligatoire.'
    }),
    description: Joi.string().trim().allow('').optional(),
    actif: Joi.boolean().optional()
});

const updateRegleSchema = Joi.object({
    nom: Joi.string().trim().optional(),
    type: Joi.string().valid('vidange', 'revision_technique', 'autre').optional(),
    seuilKm: Joi.number().positive().optional(),
    description: Joi.string().trim().allow('').optional(),
    actif: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'Veuillez renseigner au moins un champ à modifier.'
});

const createInterventionSchema = Joi.object({
    camion: Joi.string().regex(objectIdRegex).required().messages({
        'string.pattern.base': 'ID de camion invalide.',
        'any.required': 'Le camion est obligatoire.'
    }),
    regle: Joi.string().regex(objectIdRegex).required().messages({
        'string.pattern.base': 'ID de règle invalide.',
        'any.required': 'La règle de maintenance est obligatoire.'
    }),
    kilometrageIntervention: Joi.number().min(0).optional().messages({
        'number.base': 'Le kilométrage d’intervention doit être un nombre.',
        'number.min': 'Le kilométrage ne peut pas être négatif.'
    }),
    cout: Joi.number().min(0).optional().messages({
        'number.base': 'Le coût doit être un nombre.',
        'number.min': 'Le coût ne peut pas être négatif.'
    }),
    dateIntervention: Joi.date().iso().optional(),
    remarques: Joi.string().trim().allow('').optional()
});

module.exports = {
    createRegleSchema,
    updateRegleSchema,
    createInterventionSchema
};
