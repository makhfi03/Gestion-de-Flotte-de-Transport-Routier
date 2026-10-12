const camionService = require('../services/camion.service');

const create = async (req, res, next) => {
    try {
        const camion = await camionService.createCamion(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Camion enregistré avec succès.',
            data: camion
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await camionService.getAllCamions(req.query);

        return res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            data: result.camions
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const camion = await camionService.getCamionById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: camion
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const camion = await camionService.updateCamion(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Camion mis à jour avec succès.',
            data: camion
        });
    } catch (error) {
        next(error);
    }
};

const archive = async (req, res, next) => {
    try {
        const camion = await camionService.archiveCamion(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Camion archivé avec succès.',
            data: camion
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    archive
};