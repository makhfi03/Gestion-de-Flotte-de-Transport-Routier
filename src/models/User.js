const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    motDePasse: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'chauffeur'],
        default: 'chauffeur'
    },
    statut: {
        type: String,
        enum: ['actif', 'suspendu'],
        default: 'actif'
    },
    telephone: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified('motDePasse')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);