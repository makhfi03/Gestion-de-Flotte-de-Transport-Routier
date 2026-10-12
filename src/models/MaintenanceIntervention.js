const mongoose = require('mongoose');

const maintenanceInterventionSchema = new mongoose.Schema({
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: [true, 'Le camion associé est obligatoire.']
    },
    regle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceRegle',
        required: [true, 'La règle de maintenance associée est obligatoire.']
    },
    type: {
        type: String,
        enum: ['vidange', 'revision_technique', 'autre'],
        required: [true, 'Le type d’intervention est obligatoire.']
    },
    kilometrageIntervention: {
        type: Number,
        required: [true, 'Le kilométrage d’intervention est obligatoire.'],
        min: [0, 'Le kilométrage ne peut pas être négatif.']
    },
    cout: {
        type: Number,
        default: 0,
        min: [0, 'Le coût ne peut pas être négatif.']
    },
    dateIntervention: {
        type: Date,
        default: Date.now
    },
    remarques: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MaintenanceIntervention', maintenanceInterventionSchema);
