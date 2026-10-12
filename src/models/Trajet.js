const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
    siteDepart: {
        type: String,
        required: [true, 'Le site de départ est obligatoire.'],
        trim: true
    },
    siteArrivee: {
        type: String,
        required: [true, 'Le site d’arrivée est obligatoire.'],
        trim: true
    },
    marchandise: {
        type: String,
        required: [true, 'La description de la marchandise est obligatoire.'],
        trim: true
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est obligatoire.']
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est obligatoire.']
    },
    statut: {
        type: String,
        enum: ['cree', 'en_cours', 'termine', 'annule'],
        default: 'cree'
    },
    chauffeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le chauffeur est obligatoire.']
    },
    camion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: [true, 'Le camion est obligatoire.']
    },
    remorque: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remorque',
        default: null
    },
    kmDepart: {
        type: Number,
        min: [0, 'Le kilométrage de départ ne peut pas être négatif.'],
        default: null
    },
    kmArrivee: {
        type: Number,
        min: [0, 'Le kilométrage d’arrivée ne peut pas être négatif.'],
        default: null
    },
    volumeGasoil: {
        type: Number,
        min: [0, 'Le volume de gasoil ne peut pas être négatif.'],
        default: null
    },
    remarques: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

trajetSchema.virtual('distance').get(function() {
    if (this.kmDepart != null && this.kmArrivee != null) {
        return Math.max(0, this.kmArrivee - this.kmDepart);
    }
    return null;
});

trajetSchema.virtual('consommationMoyenne').get(function() {
    if (this.kmDepart != null && this.kmArrivee != null && this.volumeGasoil != null) {
        const dist = this.kmArrivee - this.kmDepart;
        if (dist > 0) {
            return Number(((this.volumeGasoil / dist) * 100).toFixed(2));
        }
    }
    return null;
});

module.exports = mongoose.model('Trajet', trajetSchema);