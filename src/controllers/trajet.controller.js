const trajetService = require('../services/trajet.service');

const create = async (req, res, next) => {
    try {
        const trajet = await trajetService.createTrajet(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Trajet planifié avec succès.',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

const assigner = async (req, res, next) => {
    try {
        const trajet = await trajetService.assignerTrajet(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Ressources réassignées avec succès.',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await trajetService.getAllTrajets(req.query);

        return res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            data: result.trajets
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const trajet = await trajetService.getTrajetById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

const getMyTrajets = async (req, res, next) => {
    try {
        const result = await trajetService.getTrajetsForChauffeur(req.user._id, req.query);

        return res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            data: result.trajets
        });
    } catch (error) {
        next(error);
    }
};

const getMyTrajetById = async (req, res, next) => {
    try {
        const trajet = await trajetService.getTrajetForChauffeurById(req.user._id, req.params.id);

        return res.status(200).json({
            status: 'success',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

const updateStatut = async (req, res, next) => {
    try {
        const trajet = await trajetService.updateStatut(req.params.id, req.user, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Statut du trajet mis à jour avec succès.',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

const cloturer = async (req, res, next) => {
    try {
        const trajet = await trajetService.cloturerTrajet(req.params.id, req.user, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Trajet clôturé avec succès.',
            data: trajet
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    assigner,
    getAll,
    getById,
    getMyTrajets,
    getMyTrajetById,
    updateStatut,
    cloturer
};