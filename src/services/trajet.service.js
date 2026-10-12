const Trajet = require('../models/Trajet');
const User = require('../models/User');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const Pneu = require('../models/Pneu');

class TrajetService { 
    async verifyResourcesAvailability({ chauffeurId, camionId, remorqueId, dateDebut, dateFin, excludeTrajetId = null }) {
        const start = new Date(dateDebut);
        const end = new Date(dateFin);

        const chauffeur = await User.findOne({ _id: chauffeurId, role: 'chauffeur' });
        if (!chauffeur) {
            const error = new Error('Chauffeur introuvable.');
            error.statusCode = 404;
            throw error;
        }

        if (chauffeur.statut === 'suspendu') {
            const error = new Error(`Le chauffeur ${chauffeur.nom} ${chauffeur.prenom} est suspendu et ne peut pas être assigné.`);
            error.statusCode = 409;
            throw error;
        }
       
        const camion = await Camion.findById(camionId);
        if (!camion) {
            const error = new Error('Camion introuvable.');
            error.statusCode = 404;
            throw error;
        }

        if (camion.statut === 'maintenance' || camion.statut === 'archive') {
            const error = new Error(`Le camion ${camion.matricule} est indisponible (statut: ${camion.statut}).`);
            error.statusCode = 409;
            throw error;
        }
        
        const pneuEnAlerte = await Pneu.findOne({ camion: camionId, statut: 'alerte_remplacement' });
        if (pneuEnAlerte) {
            const error = new Error(`Le camion ${camion.matricule} a un pneu en alerte de remplacement (${pneuEnAlerte.numeroSerie}) et ne peut pas être assigné.`);
            error.statusCode = 409;
            throw error;
        }
        
        if (remorqueId) {
            const remorque = await Remorque.findById(remorqueId);
            if (!remorque) {
                const error = new Error('Remorque introuvable.');
                error.statusCode = 404;
                throw error;
            }

            if (remorque.statut === 'maintenance' || remorque.statut === 'archive') {
                const error = new Error(`La remorque ${remorque.matricule} est indisponible (statut: ${remorque.statut}).`);
                error.statusCode = 409;
                throw error;
            }
        }
        
        const overlapFilter = {
            statut: { $in: ['cree', 'en_cours'] },
            dateDebut: { $lt: end },
            dateFin: { $gt: start }
        };

        if (excludeTrajetId) {
            overlapFilter._id = { $ne: excludeTrajetId };
        }
        
        const conflitChauffeur = await Trajet.findOne({ ...overlapFilter, chauffeur: chauffeurId });
        if (conflitChauffeur) {
            const error = new Error(`Le chauffeur ${chauffeur.nom} ${chauffeur.prenom} est déjà assigné à un autre trajet sur cette période.`);
            error.statusCode = 409;
            throw error;
        }
        
        const conflitCamion = await Trajet.findOne({ ...overlapFilter, camion: camionId });
        if (conflitCamion) {
            const error = new Error(`Le camion ${camion.matricule} est déjà assigné à un autre trajet sur cette période.`);
            error.statusCode = 409;
            throw error;
        }
        
        if (remorqueId) {
            const conflitRemorque = await Trajet.findOne({ ...overlapFilter, remorque: remorqueId });
            if (conflitRemorque) {
                const error = new Error('Cette remorque est déjà assignée à un autre trajet sur cette période.');
                error.statusCode = 409;
                throw error;
            }
        }
    }
    
    async createTrajet(data) {
        await this.verifyResourcesAvailability({
            chauffeurId: data.chauffeur,
            camionId: data.camion,
            remorqueId: data.remorque,
            dateDebut: data.dateDebut,
            dateFin: data.dateFin
        });

        const trajet = await Trajet.create(data);

        return this.getTrajetById(trajet._id);
    }
   
    async assignerTrajet(id, updateData) {
        const trajet = await Trajet.findById(id);
        if (!trajet) {
            const error = new Error('Trajet introuvable.');
            error.statusCode = 404;
            throw error;
        }

        if (trajet.statut === 'termine' || trajet.statut === 'annule') {
            const error = new Error(`Impossible de réassigner un trajet déjà ${trajet.statut}.`);
            error.statusCode = 400;
            throw error;
        }

        const chauffeurId = updateData.chauffeur || trajet.chauffeur;
        const camionId = updateData.camion || trajet.camion;
        const remorqueId = updateData.remorque !== undefined ? updateData.remorque : trajet.remorque;

        await this.verifyResourcesAvailability({
            chauffeurId,
            camionId,
            remorqueId,
            dateDebut: trajet.dateDebut,
            dateFin: trajet.dateFin,
            excludeTrajetId: id
        });

        trajet.chauffeur = chauffeurId;
        trajet.camion = camionId;
        trajet.remorque = remorqueId;

        await trajet.save();

        return this.getTrajetById(trajet._id);
    }
    
    async getAllTrajets(query = {}) {
        const filter = {};

        if (query.statut) filter.statut = query.statut;
        if (query.chauffeur) filter.chauffeur = query.chauffeur;
        if (query.camion) filter.camion = query.camion;
        if (query.siteDepart) filter.siteDepart = new RegExp(query.siteDepart.trim(), 'i');
        if (query.siteArrivee) filter.siteArrivee = new RegExp(query.siteArrivee.trim(), 'i');

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const total = await Trajet.countDocuments(filter);
        const trajets = await Trajet.find(filter)
            .populate('chauffeur', 'nom prenom email telephone')
            .populate('camion', 'matricule marque modele kilometrage')
            .populate('remorque', 'matricule type capaciteCharge')
            .sort({ dateDebut: -1 })
            .skip(skip)
            .limit(limit);

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            trajets
        };
    }
   
    async getTrajetById(id) {
        const trajet = await Trajet.findById(id)
            .populate('chauffeur', 'nom prenom email telephone')
            .populate('camion', 'matricule marque modele kilometrage')
            .populate('remorque', 'matricule type capaciteCharge');

        if (!trajet) {
            const error = new Error('Trajet introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return trajet;
    }

    async getTrajetsForChauffeur(chauffeurId, query = {}) {
        const filter = { chauffeur: chauffeurId };

        if (query.statut) {
            filter.statut = query.statut;
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const total = await Trajet.countDocuments(filter);
        const trajets = await Trajet.find(filter)
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type capaciteCharge')
            .sort({ dateDebut: -1 })
            .skip(skip)
            .limit(limit);

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            trajets
        };
    }

    async getTrajetForChauffeurById(chauffeurId, trajetId) {
        const trajet = await Trajet.findById(trajetId)
            .populate('camion', 'matricule marque modele')
            .populate('remorque', 'matricule type capaciteCharge');

        if (!trajet) {
            const error = new Error('Trajet introuvable.');
            error.statusCode = 404;
            throw error;
        }

        if (trajet.chauffeur.toString() !== chauffeurId.toString()) {
            const error = new Error('Accès refusé. Ce trajet ne vous est pas assigné.');
            error.statusCode = 403;
            throw error;
        }

        return trajet;
    }

    async updateStatut(trajetId, user, { statut, kmDepart, remarques }) {
        const trajet = await Trajet.findById(trajetId);
        if (!trajet) {
            const error = new Error('Trajet introuvable.');
            error.statusCode = 404;
            throw error;
        }
        
        const currentUserId = (user._id || user.id).toString();
        if (user.role === 'chauffeur' && trajet.chauffeur.toString() !== currentUserId) {
            const error = new Error('Accès refusé. Vous n\'êtes pas le chauffeur assigné à ce trajet.');
            error.statusCode = 403;
            throw error;
        }
        
        if (trajet.statut === 'termine' || trajet.statut === 'annule') {
            const error = new Error(`Impossible de modifier un trajet déjà ${trajet.statut}.`);
            error.statusCode = 400;
            throw error;
        }
        
        if (statut === 'annule' && user.role !== 'admin') {
            const error = new Error('Seul un administrateur peut annuler un trajet.');
            error.statusCode = 403;
            throw error;
        }
        
        if (statut === 'en_cours') {
            if (trajet.statut !== 'cree') {
                const error = new Error(`Transition invalide : impossible de passer de "${trajet.statut}" à "en_cours".`);
                error.statusCode = 400;
                throw error;
            }

            const camion = await Camion.findById(trajet.camion);
            if (!camion) {
                const error = new Error('Camion associé introuvable.');
                error.statusCode = 404;
                throw error;
            }

            const departKm = (kmDepart !== undefined && kmDepart !== null) ? kmDepart : camion.kilometrage;
            if (departKm < camion.kilometrage) {
                const error = new Error(`Le kilométrage de départ (${departKm} km) ne peut pas être inférieur au kilométrage actuel du camion (${camion.kilometrage} km).`);
                error.statusCode = 400;
                throw error;
            }

            trajet.kmDepart = departKm;
            trajet.statut = 'en_cours';
            
            await Camion.findByIdAndUpdate(trajet.camion, { statut: 'en_mission' });
            if (trajet.remorque) {
                await Remorque.findByIdAndUpdate(trajet.remorque, { statut: 'en_mission' });
            }
        } else if (statut === 'annule') {
            if (trajet.statut === 'en_cours') {
                
                await Camion.findByIdAndUpdate(trajet.camion, { statut: 'disponible' });
                if (trajet.remorque) {
                    await Remorque.findByIdAndUpdate(trajet.remorque, { statut: 'disponible' });
                }
            }
            trajet.statut = 'annule';
        } else if (statut === 'termine') {
            if (trajet.statut !== 'en_cours') {
                const error = new Error('Transition invalide : le trajet doit être "en_cours" pour être terminé.');
                error.statusCode = 400;
                throw error;
            }
            trajet.statut = 'termine';
            await Camion.findByIdAndUpdate(trajet.camion, { statut: 'disponible' });
            if (trajet.remorque) {
                await Remorque.findByIdAndUpdate(trajet.remorque, { statut: 'disponible' });
            }
        }

        if (remarques !== undefined) {
            trajet.remarques = remarques;
        }

        await trajet.save();
        return this.getTrajetById(trajet._id);
    }
}

module.exports = new TrajetService();