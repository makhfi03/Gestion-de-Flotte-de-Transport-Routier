const Remorque = require('../models/Remorque');

class RemorqueService {

    async createRemorque(data) {
        const matriculeUpper = data.matricule.toUpperCase().trim();

        const existingRemorque = await Remorque.findOne({ matricule: matriculeUpper });
        if (existingRemorque) {
            const error = new Error('Ce matricule de remorque existe déjà.');
            error.statusCode = 400;
            throw error;
        }

        const remorque = await Remorque.create({
            ...data,
            matricule: matriculeUpper
        });

        return remorque;
    }

    async getAllRemorques(query = {}) {
        const filter = {};

        if (query.statut) {
            filter.statut = query.statut;
        }

        if (query.type) {
            filter.type = query.type.toLowerCase().trim();
        }

        if (query.search) {
            filter.matricule = new RegExp(query.search.trim(), 'i');
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const total = await Remorque.countDocuments(filter);
        const remorques = await Remorque.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            remorques
        };
    }

    async getRemorqueById(id) {
        const remorque = await Remorque.findById(id);

        if (!remorque) {
            const error = new Error('Remorque introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return remorque;
    }

    async updateRemorque(id, data) {
        const remorque = await Remorque.findByIdAndUpdate(
            id,
            data,
            { returnDocument: 'after', runValidators: true }
        );

        if (!remorque) {
            const error = new Error('Remorque introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return remorque;
    }

    async archiveRemorque(id) {
        const remorque = await Remorque.findByIdAndUpdate(
            id,
            { statut: 'archive' },
            { returnDocument: 'after', runValidators: true }
        );

        if (!remorque) {
            const error = new Error('Remorque introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return remorque;
    }
}

module.exports = new RemorqueService();