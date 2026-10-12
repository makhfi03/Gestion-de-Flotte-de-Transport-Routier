const User = require('../models/User');

const createChauffeur = async (data) => {
    const { email } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Cet email est déjà utilisé.');
        error.statusCode = 400;
        throw error;
    }

    const chauffeur = await User.create({
        ...data,
        role: 'chauffeur',
        statut: 'actif'
    });

    const result = chauffeur.toObject();
    delete result.motDePasse;
    return result;
};

const getAllChauffeurs = async (query = {}) => {
    const filter = { role: 'chauffeur' };

    if (query.statut) {
        filter.statut = query.statut;
    }

    const chauffeurs = await User.find(filter)
        .select('-motDePasse')
        .sort({ createdAt: -1 });

    return chauffeurs;
};

const getChauffeurById = async (id) => {
    const chauffeur = await User.findOne({ _id: id, role: 'chauffeur' })
        .select('-motDePasse');

    if (!chauffeur) {
        const error = new Error('Chauffeur introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return chauffeur;
};

const updateStatut = async (id, statut) => {
    const chauffeur = await User.findOneAndUpdate(
        { _id: id, role: 'chauffeur' },
        { statut },
        { returnDocument: 'after', runValidators: true }
    ).select('-motDePasse');

    if (!chauffeur) {
        const error = new Error('Chauffeur introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return chauffeur;
};

module.exports = {
    createChauffeur,
    getAllChauffeurs,
    getChauffeurById,
    updateStatut
};