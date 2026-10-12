const remorqueService = require('../services/remorque.service');

const create = async (req, res, next) => {
    try {
        const remorque = await remorqueService.createRemorque(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Remorque enregistrée avec succès.',
            data: remorque
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await remorqueService.getAllRemorques(req.query);

        return res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            data: result.remorques
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const remorque = await remorqueService.getRemorqueById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: remorque
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const remorque = await remorqueService.updateRemorque(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Remorque mise à jour avec succès.',
            data: remorque
        });
    } catch (error) {
        next(error);
    }
};

const archive = async (req, res, next) => {
    try {
        const remorque = await remorqueService.archiveRemorque(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Remorque archivée avec succès.',
            data: remorque
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