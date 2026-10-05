const Camion = require('../models/Camion');

class CamionService {

    async createCamion(data) {
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
    }


    async getAllCamions(query = {}) {
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
    }


    async getCamionById(id) {
        const camion = await Camion.findById(id);

        if (!camion) {
            const error = new Error('Camion introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return camion;
    }


    async updateCamion(id, data) {
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
    }


    async archiveCamion(id) {
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
    }
}

module.exports = new CamionService();