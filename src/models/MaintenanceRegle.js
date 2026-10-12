const mongoose = require('mongoose');

const maintenanceRegleSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom de la règle est obligatoire.'],
        trim: true
    },
    type: {
        type: String,
        enum: ['vidange', 'revision_technique', 'autre'],
        required: [true, 'Le type de maintenance est obligatoire.']
    },
    seuilKm: {
        type: Number,
        required: [true, 'Le seuil kilométrique est obligatoire.'],
        min: [1, 'Le seuil kilométrique doit être supérieur à zéro.']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    actif: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MaintenanceRegle', maintenanceRegleSchema);
