const Joi = require('joi');

const positionsValides = [
    'avant-gauche',
    'avant-droit',
    'arriere-gauche-interieur',
    'arriere-gauche-exterieur',
    'arriere-droit-interieur',
    'arriere-droit-exterieur',
    'secours',
    'non_installe'
];

const createPneuSchema = Joi.object({
    numeroSerie: Joi.string().trim().required().messages({
        'string.empty': 'Le numéro de série est obligatoire.',
        'any.required': 'Le numéro de série est obligatoire.'
    }),
    marque: Joi.string().trim().required().messages({
        'string.empty': 'La marque est obligatoire.',
        'any.required': 'La marque est obligatoire.'
    }),
    dimension: Joi.string().trim().required().messages({
        'string.empty': 'La dimension est obligatoire.',
        'any.required': 'La dimension est obligatoire.'
    }),
    seuilMaxKm: Joi.number().min(1000).required().messages({
        'number.base': 'Le seuil kilométrique maximal doit être un nombre.',
        'number.min': 'Le seuil maximal doit être d’au moins 1000 km.',
        'any.required': 'Le seuil kilométrique maximal est obligatoire.'
    }),
    kmUsure: Joi.number().min(0).default(0).messages({
        'number.min': 'Le kilométrage d’usure ne peut pas être négatif.'
    }),
    position: Joi.string().valid(...positionsValides).default('non_installe'),
    camion: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).optional().messages({
        'string.pattern.base': 'ID de camion invalide.'
    })
});

const updatePneuSchema = Joi.object({
    marque: Joi.string().trim(),
    dimension: Joi.string().trim(),
    seuilMaxKm: Joi.number().min(1000).messages({
        'number.min': 'Le seuil maximal doit être d’au moins 1000 km.'
    }),
    kmUsure: Joi.number().min(0).messages({
        'number.min': 'Le kilométrage d’usure ne peut pas être négatif.'
    }),
    statut: Joi.string().valid('bon_etat', 'alerte_remplacement', 'remplace', 'archive')
}).min(1).messages({
    'object.min': 'Veuillez fournir au moins un champ à mettre à jour.'
});

const affecterPneuSchema = Joi.object({
    camionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).required().messages({
        'string.pattern.base': 'ID de camion invalide.',
        'any.required': 'L’ID du camion est obligatoire (ou null pour détacher).'
    }),
    position: Joi.string().valid(...positionsValides).required().messages({
        'any.only': 'Position de pneu invalide.',
        'any.required': 'La position de montage est obligatoire.'
    })
});

module.exports = {
    createPneuSchema,
    updatePneuSchema,
    affecterPneuSchema
};