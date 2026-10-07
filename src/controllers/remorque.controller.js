const remorqueService = require('../services/remorque.service');

class RemorqueController {
    
    async create(req, res, next) {
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
    }
    
    async getAll(req, res, next) {
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
    }
    
    async getById(req, res, next) {
        try {
            const remorque = await remorqueService.getRemorqueById(req.params.id);

            return res.status(200).json({
                status: 'success',
                data: remorque
            });
        } catch (error) {
            next(error);
        }
    }
    
    async update(req, res, next) {
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
    }

    async archive(req, res, next) {
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
    }
}

module.exports = new RemorqueController();