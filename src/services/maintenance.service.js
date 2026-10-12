const MaintenanceRegle = require('../models/MaintenanceRegle');
const MaintenanceIntervention = require('../models/MaintenanceIntervention');
const Camion = require('../models/Camion');

const createRegle = async (data) => {
    return MaintenanceRegle.create(data);
};

const getAllRegles = async (query = {}) => {
    const filter = {};
    if (query.type) filter.type = query.type;
    if (query.actif !== undefined) filter.actif = query.actif === 'true';

    return MaintenanceRegle.find(filter).sort({ createdAt: -1 });
};

const getRegleById = async (id) => {
    const regle = await MaintenanceRegle.findById(id);
    if (!regle) {
        const error = new Error('Règle de maintenance introuvable.');
        error.statusCode = 404;
        throw error;
    }
    return regle;
};

const updateRegle = async (id, data) => {
    const regle = await MaintenanceRegle.findByIdAndUpdate(
        id,
        data,
        { returnDocument: 'after', runValidators: true }
    );

    if (!regle) {
        const error = new Error('Règle de maintenance introuvable.');
        error.statusCode = 404;
        throw error;
    }

    return regle;
};

const verifierAlertesCamion = async (camionId) => {
    const camion = await Camion.findById(camionId);
    if (!camion) {
        return null;
    }

    const regles = await MaintenanceRegle.find({ actif: true });
    const alertes = [];

    for (const regle of regles) {
        const lastIntervention = await MaintenanceIntervention.findOne({
            camion: camionId,
            regle: regle._id
        }).sort({ kilometrageIntervention: -1 });

        const dernierKm = lastIntervention ? lastIntervention.kilometrageIntervention : 0;
        const kmParcourus = camion.kilometrage - dernierKm;

        if (kmParcourus >= regle.seuilKm) {
            alertes.push({
                regle: regle.nom,
                type: regle.type,
                seuilKm: regle.seuilKm,
                kmParcourus
            });
        }
    }

    if (alertes.length > 0) {
        await Camion.findByIdAndUpdate(camionId, { statut: 'maintenance' });
        return {
            declenchee: true,
            alertes
        };
    }

    return {
        declenchee: false,
        alertes: []
    };
};

const createIntervention = async (data) => {
    const camion = await Camion.findById(data.camion);
    if (!camion) {
        const error = new Error('Camion introuvable.');
        error.statusCode = 404;
        throw error;
    }

    const regle = await MaintenanceRegle.findById(data.regle);
    if (!regle) {
        const error = new Error('Règle de maintenance introuvable.');
        error.statusCode = 404;
        throw error;
    }

    const km = data.kilometrageIntervention !== undefined ? data.kilometrageIntervention : camion.kilometrage;

    const intervention = await MaintenanceIntervention.create({
        ...data,
        type: regle.type,
        kilometrageIntervention: km
    });

    const verification = await verifierAlertesCamion(data.camion);
    if (!verification || !verification.declenchee) {
        await Camion.findByIdAndUpdate(data.camion, { statut: 'disponible' });
    }

    return MaintenanceIntervention.findById(intervention._id)
        .populate('camion', 'matricule marque modele kilometrage statut')
        .populate('regle', 'nom type seuilKm');
};

const getAllInterventions = async (query = {}) => {
    const filter = {};
    if (query.camion) filter.camion = query.camion;
    if (query.regle) filter.regle = query.regle;
    if (query.type) filter.type = query.type;

    return MaintenanceIntervention.find(filter)
        .populate('camion', 'matricule marque modele')
        .populate('regle', 'nom type seuilKm')
        .sort({ dateIntervention: -1 });
};

module.exports = {
    createRegle,
    getAllRegles,
    getRegleById,
    updateRegle,
    verifierAlertesCamion,
    createIntervention,
    getAllInterventions
};
