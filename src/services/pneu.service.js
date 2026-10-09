const Pneu = require('../models/Pneu');
const Camion = require('../models/Camion');

class PneuService {
    async createPneu(data) {
        const numeroSerieUpper = data.numeroSerie.toUpperCase().trim();

        const existingPneu = await Pneu.findOne({ numeroSerie: numeroSerieUpper });
        if (existingPneu) {
            const error = new Error('Ce numéro de série de pneu existe déjà.');
            error.statusCode = 400;
            throw error;
        }
        
        if (data.camion) {
            const camion = await Camion.findById(data.camion);
            if (!camion) {
                const error = new Error('Camion introuvable.');
                error.statusCode = 404;
                throw error;
            }

            if (data.position && data.position !== 'non_installe' && data.position !== 'secours') {
                const occupier = await Pneu.findOne({ camion: data.camion, position: data.position });
                if (occupier) {
                    const error = new Error(`La position "${data.position}" est déjà occupée par le pneu ${occupier.numeroSerie}.`);
                    error.statusCode = 400;
                    throw error;
                }
            }
        }

        const pneu = await Pneu.create({
            ...data,
            numeroSerie: numeroSerieUpper
        });

        return pneu;
    }

    async getAllPneus(query = {}) {
        const filter = {};

        if (query.statut) {
            filter.statut = query.statut;
        }

        if (query.camion) {
            filter.camion = query.camion;
        }

        if (query.position) {
            filter.position = query.position;
        }

        if (query.search) {
            const regex = new RegExp(query.search.trim(), 'i');
            filter.$or = [
                { numeroSerie: regex },
                { marque: regex }
            ];
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const total = await Pneu.countDocuments(filter);
        const pneus = await Pneu.find(filter)
            .populate('camion', 'matricule marque modele')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            pneus
        };
    }
  
    async getPneuById(id) {
        const pneu = await Pneu.findById(id).populate('camion', 'matricule marque modele');

        if (!pneu) {
            const error = new Error('Pneu introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return pneu;
    }
  
    async updatePneu(id, data) {
        const pneu = await Pneu.findById(id);
        if (!pneu) {
            const error = new Error('Pneu introuvable.');
            error.statusCode = 404;
            throw error;
        }

        Object.assign(pneu, data);
        
        if (pneu.kmUsure >= pneu.seuilMaxKm && pneu.statut === 'bon_etat') {
            pneu.statut = 'alerte_remplacement';
        }

        await pneu.save();
        return pneu;
    }
    
    async affecterPneu(id, { camionId, position }) {
        const pneu = await Pneu.findById(id);
        if (!pneu) {
            const error = new Error('Pneu introuvable.');
            error.statusCode = 404;
            throw error;
        }
        
        if (!camionId || position === 'non_installe') {
            pneu.camion = null;
            pneu.position = 'non_installe';
            await pneu.save();
            return pneu;
        }
        
        const camion = await Camion.findById(camionId);
        if (!camion) {
            const error = new Error('Camion introuvable.');
            error.statusCode = 404;
            throw error;
        }
        
        if (position !== 'secours') {
            const occupier = await Pneu.findOne({
                camion: camionId,
                position,
                _id: { $ne: id }
            });

            if (occupier) {
                const error = new Error(`La position "${position}" est déjà occupée sur ce camion par le pneu ${occupier.numeroSerie}.`);
                error.statusCode = 400;
                throw error;
            }
        }

        pneu.camion = camionId;
        pneu.position = position;
        await pneu.save();

        return pneu.populate('camion', 'matricule marque modele');
    }
    
    async archivePneu(id) {
        const pneu = await Pneu.findByIdAndUpdate(
            id,
            { statut: 'archive', camion: null, position: 'non_installe' },
            { returnDocument: 'after', runValidators: true }
        );

        if (!pneu) {
            const error = new Error('Pneu introuvable.');
            error.statusCode = 404;
            throw error;
        }

        return pneu;
    }
}

module.exports = new PneuService();