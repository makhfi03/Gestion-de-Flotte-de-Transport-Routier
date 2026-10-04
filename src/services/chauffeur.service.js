const User = require('../models/User');

class ChauffeurService {

    async createChauffeur(data) {
        const { email } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('Cet email est déjà utilisé.');
            error.statusCode = 400;
            throw error;
        }

        const chauffeur = await User.create({
            ...data,
            role: 'chauffeur',
            statut: 'actif'
        });

        const result = chauffeur.toObject();
        delete result.motDePasse;
        return result;
    }

    async getAllChauffeurs(query = {}) {
        const filter = { role: 'chauffeur' };

        if (query.statut) {
            filter.statut = query.statut;
        }

        const chauffeurs = await User.find(filter)
            .select('-motDePasse')
            .sort({ createdAt: -1 });

        return chauffeurs;
    }


    async getChauffeurById(id) {
        const chauffeur = await User.findOne({ _id: id, role: 'chauffeur' })
            .select('-motDePasse');

        if (!chauffeur) {
            const error = new Error('Chauffeur introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return chauffeur;
    }


    async updateStatut(id, statut) {
        const chauffeur = await User.findOneAndUpdate(
            { _id: id, role: 'chauffeur' },
            { statut },
            { new: true, runValidators: true }
        ).select('-motDePasse');

        if (!chauffeur) {
            const error = new Error('Chauffeur introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return chauffeur;
    }
}

module.exports = new ChauffeurService();