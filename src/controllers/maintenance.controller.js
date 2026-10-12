const maintenanceService = require('../services/maintenance.service');

const createRegle = async (req, res, next) => {
    try {
        const regle = await maintenanceService.createRegle(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Règle de maintenance créée avec succès.',
            data: regle
        });
    } catch (error) {
        next(error);
    }
};

const getAllRegles = async (req, res, next) => {
    try {
        const regles = await maintenanceService.getAllRegles(req.query);

        return res.status(200).json({
            status: 'success',
            total: regles.length,
            data: regles
        });
    } catch (error) {
        next(error);
    }
};

const getRegleById = async (req, res, next) => {
    try {
        const regle = await maintenanceService.getRegleById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: regle
        });
    } catch (error) {
        next(error);
    }
};

const updateRegle = async (req, res, next) => {
    try {
        const regle = await maintenanceService.updateRegle(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Règle de maintenance mise à jour avec succès.',
            data: regle
        });
    } catch (error) {
        next(error);
    }
};

const createIntervention = async (req, res, next) => {
    try {
        const intervention = await maintenanceService.createIntervention(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Intervention de maintenance enregistrée avec succès.',
            data: intervention
        });
    } catch (error) {
        next(error);
    }
};

const getAllInterventions = async (req, res, next) => {
    try {
        const interventions = await maintenanceService.getAllInterventions(req.query);

        return res.status(200).json({
            status: 'success',
            total: interventions.length,
            data: interventions
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRegle,
    getAllRegles,
    getRegleById,
    updateRegle,
    createIntervention,
    getAllInterventions
};
