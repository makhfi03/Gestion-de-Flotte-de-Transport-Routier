const mongoose = require('mongoose');

const pneuSchema = new mongoose.Schema({
    numeroSerie: {
        type: String,
        required: [true, 'Le numéro de série est obligatoire.'],
        unique: true,
        uppercase: true,
        trim: true
    },
    marque: {
        type: String,
        required: [true, 'La marque est obligatoire.'],
        trim: true
    },
    dimension: {
        type: String,
        required: [true, 'La dimension est obligatoire.'],
        trim: true
    },
    position: {
        type: String,
        enum: [
            'avant-gauche',
            'avant-droit',
            'arriere-gauche-interieur',
            'arriere-gauche-exterieur',
            'arriere-droit-interieur',
            'arriere-droit-exterieur',
            'secours',
            'non_installe'
        ],
        default: 'non_installe'
    },
    kmUsure: {
        type: Number,
        default: 0,
        min: [0, 'Le kilométrage d’usure ne peut pas être négatif.']
    },
    seuilMaxKm: {
        type: Number,
        required: [true, 'Le seuil kilométrique maximal est obligatoire.'],
        min: [1000, 'Le seuil kilométrique doit être d’au moins 1000 km.']
    },
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        default: null
    },
    statut: {
        type: String,
        enum: ['bon_etat', 'alerte_remplacement', 'remplace', 'archive'],
        default: 'bon_etat'
    }
}, {
    timestamps: true
});

pneuSchema.pre('save', function () {
    if (this.kmUsure >= this.seuilMaxKm && this.statut === 'bon_etat') {
        this.statut = 'alerte_remplacement';
    }
});

module.exports = mongoose.model('Pneu', pneuSchema);