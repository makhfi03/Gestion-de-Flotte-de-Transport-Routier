const Camion = require('../models/Camion');

const createCamion = async (data) => {
    const matriculeUpper = data.matricule.toUpperCase().trim();

    const existingCamion = await Camion.findOne({ matricule: matriculeUpper });
    if (existingCamion) {
        const error = new Error('Ce matricule existe déjà.');
        error.statusCode = 400;
        throw error;
    }

    const camion = await Camion.create({
        ...data,
        matricule: matriculeUpper
    });

    return camion;
};

const getAllCamions = async (query = {}) => {
    const filter = {};

    if (query.statut) {
        filter.statut = query.statut;
    }

    if (query.search) {
        const searchRegex = new RegExp(query.search.trim(), 'i');
        filter.$or = [
            { matricule: searchRegex },
            { marque: searchRegex },
            { modele: searchRegex }
        ];
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Camion.countDocuments(filter);
    const camions = await Camion.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        camions
    };
};

const getCamionById = async (id) => {
    const camion = await Camion.findById(id);

    if (!camion) {
        const error = new Error('Camion introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

const updateCamion = async (id, data) => {
    const camion = await Camion.findByIdAndUpdate(
        id,
        data,
        { returnDocument: 'after', runValidators: true }
    );

    if (!camion) {
        const error = new Error('Camion introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

const archiveCamion = async (id) => {
    const camion = await Camion.findByIdAndUpdate(
        id,
        { statut: 'archive' },
        { returnDocument: 'after', runValidators: true }
    );

    if (!camion) {
        const error = new Error('Camion introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return camion;
};

module.exports = {
    createCamion,
    getAllCamions,
    getCamionById,
    updateCamion,
    archiveCamion
};