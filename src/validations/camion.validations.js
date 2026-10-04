const Joi = require('joi');

const createCamionSchema = Joi.object({
    matricule: Joi.string().trim().required().messages({
        'string.empty': 'Le matricule est obligatoire.',
        'any.required': 'Le matricule est obligatoire.'
    }),
    marque: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'La marque est obligatoire.',
        'string.min': 'La marque doit contenir au moins 2 caractères.',
        'any.required': 'La marque est obligatoire.'
    }),
    modele: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Le modèle est obligatoire.',
        'string.min': 'Le modèle doit contenir au moins 2 caractères.',
        'any.required': 'Le modèle est obligatoire.'
    }),
    kilometrage: Joi.number().min(0).default(0).messages({
        'number.min': 'Le kilométrage ne peut pas être négatif.'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance', 'archive').default('disponible').messages({
        'any.only': 'Le statut doit être : disponible, en_mission, maintenance ou archive.'
    })
});

const updateCamionSchema = Joi.object({
    marque: Joi.string().trim().min(2).max(50),
    modele: Joi.string().trim().min(2).max(50),
    kilometrage: Joi.number().min(0).messages({
        'number.min': 'Le kilométrage ne peut pas être négatif.'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance', 'archive').messages({
        'any.only': 'Le statut doit être : disponible, en_mission, maintenance ou archive.'
    })
}).min(1).messages({
    'object.min': 'Veuillez fournir au moins un champ à mettre à jour.'
});

module.exports = {
    createCamionSchema,
    updateCamionSchema
};