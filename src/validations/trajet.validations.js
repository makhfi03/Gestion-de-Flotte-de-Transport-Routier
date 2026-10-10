const Joi = require('joi');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createTrajetSchema = Joi.object({
    siteDepart: Joi.string().trim().required().messages({
        'string.empty': 'Le site de départ est obligatoire.',
        'any.required': 'Le site de départ est obligatoire.'
    }),
    siteArrivee: Joi.string().trim().required().messages({
        'string.empty': 'Le site d’arrivée est obligatoire.',
        'any.required': 'Le site d’arrivée est obligatoire.'
    }),
    marchandise: Joi.string().trim().required().messages({
        'string.empty': 'La description de la marchandise est obligatoire.',
        'any.required': 'La description de la marchandise est obligatoire.'
    }),
    dateDebut: Joi.date().iso().required().messages({
        'date.base': 'La date de début doit être une date valide (format ISO).',
        'any.required': 'La date de début est obligatoire.'
    }),
    dateFin: Joi.date().iso().greater(Joi.ref('dateDebut')).required().messages({
        'date.base': 'La date de fin doit être une date valide (format ISO).',
        'date.greater': 'La date de fin doit être strictement postérieure à la date de début.',
        'any.required': 'La date de fin est obligatoire.'
    }),
    chauffeur: Joi.string().regex(objectIdRegex).required().messages({
        'string.pattern.base': 'ID de chauffeur invalide.',
        'any.required': 'Le chauffeur est obligatoire.'
    }),
    camion: Joi.string().regex(objectIdRegex).required().messages({
        'string.pattern.base': 'ID de camion invalide.',
        'any.required': 'Le camion est obligatoire.'
    }),
    remorque: Joi.string().regex(objectIdRegex).allow(null).optional().messages({
        'string.pattern.base': 'ID de remorque invalide.'
    }),
    remarques: Joi.string().trim().allow('').optional()
});

const assignerTrajetSchema = Joi.object({
    chauffeur: Joi.string().regex(objectIdRegex).messages({
        'string.pattern.base': 'ID de chauffeur invalide.'
    }),
    camion: Joi.string().regex(objectIdRegex).messages({
        'string.pattern.base': 'ID de camion invalide.'
    }),
    remorque: Joi.string().regex(objectIdRegex).allow(null).messages({
        'string.pattern.base': 'ID de remorque invalide.'
    })
}).min(1).messages({
    'object.min': 'Veuillez fournir au moins une ressource à réassigner.'
});

module.exports = {
    createTrajetSchema,
    assignerTrajetSchema
};