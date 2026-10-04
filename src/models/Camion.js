const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
    matricule: {
        type: String,
        required: [true, 'Le matricule est obligatoire.'],
        unique: true,
        uppercase: true,
        trim: true
    },
    marque: {
        type: String,
        required: [true, 'La marque est obligatoire.'],
        trim: true
    },
    modele: {
        type: String,
        required: [true, 'Le modèle est obligatoire.'],
        trim: true
    },
    kilometrage: {
        type: Number,
        default: 0,
        min: [0, 'Le kilométrage ne peut pas être négatif.']
    },
    statut: {
        type: String,
        enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
        default: 'disponible'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Camion', camionSchema);