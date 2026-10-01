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

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('motDePasse')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.motDePasse = await bcrypt.hash(user.motDePasse, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.motDePasse);
};

module.exports = mongoose.model('User', userSchema);