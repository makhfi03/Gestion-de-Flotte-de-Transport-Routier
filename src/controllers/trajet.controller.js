const trajetService = require('../services/trajet.service');

class TrajetController {   
    async create(req, res, next) {
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
    }
    
    async assigner(req, res, next) {
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
    }
    
    async getAll(req, res, next) {
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
    }
    
    async getById(req, res, next) {
        try {
            const trajet = await trajetService.getTrajetById(req.params.id);

            return res.status(200).json({
                status: 'success',
                data: trajet
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TrajetController();