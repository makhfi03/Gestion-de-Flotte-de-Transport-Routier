const mongoose = require('mongoose');

const remorqueSchema = new mongoose.Schema({
    matricule: {
        type: String,
        required: [true, 'Le matricule est obligatoire.'],
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Le type de remorque est obligatoire.'],
        enum: {
            values: ['benne', 'citerne', 'frigorifique', 'plateau'],
            message: 'Le type doit être: benne, citerne, frigorifique ou plateau.'
        },
        lowercase: true,
        trim: true
    },
    capaciteCharge: {
        type: Number,
        required: [true, 'La capacité de charge est obligatoire.'],
        min: [0.1, 'La capacité de charge doit être supérieure à 0 tonne.']
    },
    statut: {
        type: String,
        enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
        default: 'disponible'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Remorque', remorqueSchema);