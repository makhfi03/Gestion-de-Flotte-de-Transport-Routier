const chauffeurService = require('../services/chauffeur.service');

const create = async (req, res, next) => {
    try {
        const chauffeur = await chauffeurService.createChauffeur(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Chauffeur créé avec succès.',
            data: chauffeur
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const chauffeurs = await chauffeurService.getAllChauffeurs(req.query);

        return res.status(200).json({
            status: 'success',
            total: chauffeurs.length,
            data: chauffeurs
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const chauffeur = await chauffeurService.getChauffeurById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: chauffeur
        });
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { statut } = req.body;
        const chauffeur = await chauffeurService.updateStatut(req.params.id, statut);

        return res.status(200).json({
            status: 'success',
            message: `Statut du chauffeur mis à jour : ${statut}.`,
            data: chauffeur
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    updateStatus
};