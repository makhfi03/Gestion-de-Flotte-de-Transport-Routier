const pneuService = require('../services/pneu.service');

const create = async (req, res, next) => {
    try {
        const pneu = await pneuService.createPneu(req.body);

        return res.status(201).json({
            status: 'success',
            message: 'Pneu enregistré avec succès.',
            data: pneu
        });
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await pneuService.getAllPneus(req.query);

        return res.status(200).json({
            status: 'success',
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            data: result.pneus
        });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const pneu = await pneuService.getPneuById(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: pneu
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const pneu = await pneuService.updatePneu(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Pneu mis à jour avec succès.',
            data: pneu
        });
    } catch (error) {
        next(error);
    }
};

const affecter = async (req, res, next) => {
    try {
        const pneu = await pneuService.affecterPneu(req.params.id, req.body);

        return res.status(200).json({
            status: 'success',
            message: 'Affectation du pneu mise à jour avec succès.',
            data: pneu
        });
    } catch (error) {
        next(error);
    }
};

const archive = async (req, res, next) => {
    try {
        const pneu = await pneuService.archivePneu(req.params.id);

        return res.status(200).json({
            status: 'success',
            message: 'Pneu archivé avec succès.',
            data: pneu
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
    affecter,
    archive
};