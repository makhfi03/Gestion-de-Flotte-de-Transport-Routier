const pneuService = require('../services/pneu.service');

class PneuController {    
    async create(req, res, next) {
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
    }
    
    async getAll(req, res, next) {
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
    }
    
    async getById(req, res, next) {
        try {
            const pneu = await pneuService.getPneuById(req.params.id);

            return res.status(200).json({
                status: 'success',
                data: pneu
            });
        } catch (error) {
            next(error);
        }
    }
    
    async update(req, res, next) {
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
    }
    
    async affecter(req, res, next) {
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
    }
    
    async archive(req, res, next) {
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
    }
}

module.exports = new PneuController();