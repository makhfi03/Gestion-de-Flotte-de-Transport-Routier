const Joi = require('joi');

const createRemorqueSchema = Joi.object({
    matricule: Joi.string().trim().required().messages({
        'string.empty': 'Le matricule est obligatoire.',
        'any.required': 'Le matricule est obligatoire.'
    }),
    type: Joi.string().trim().lowercase().valid('benne', 'citerne', 'frigorifique', 'plateau').required().messages({
        'any.only': 'Le type doit être: benne, citerne, frigorifique ou plateau.',
        'string.empty': 'Le type de remorque est obligatoire.',
        'any.required': 'Le type de remorque est obligatoire.'
    }),
    capaciteCharge: Joi.number().min(0.1).required().messages({
        'number.base': 'La capacité de charge doit être un nombre.',
        'number.min': 'La capacité de charge doit être supérieure à 0 tonne.',
        'any.required': 'La capacité de charge est obligatoire.'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance', 'archive').default('disponible').messages({
        'any.only': 'Le statut doit être: disponible, en_mission, maintenance ou archive.'
    })
});

const updateRemorqueSchema = Joi.object({
    type: Joi.string().trim().lowercase().valid('benne', 'citerne', 'frigorifique', 'plateau').messages({
        'any.only': 'Le type doit être: benne, citerne, frigorifique ou plateau.'
    }),
    capaciteCharge: Joi.number().min(0.1).messages({
        'number.base': 'La capacité de charge doit être un nombre.',
        'number.min': 'La capacité de charge doit être supérieure à 0 tonne.'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance', 'archive').messages({
        'any.only': 'Le statut doit être: disponible, en_mission, maintenance ou archive.'
    })
}).min(1).messages({
    'object.min': 'Veuillez fournir au moins un champ à mettre à jour.'
});

module.exports = {
    createRemorqueSchema,
    updateRemorqueSchema
};