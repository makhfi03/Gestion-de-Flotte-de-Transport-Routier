const Trajet = require('../models/Trajet');
const Camion = require('../models/Camion');
const Pneu = require('../models/Pneu');
const MaintenanceIntervention = require('../models/MaintenanceIntervention');

const getRapportConsommation = async () => {
    const trajets = await Trajet.find({ statut: 'termine' })
        .populate('camion', 'matricule marque modele');

    let volumeTotalGasoil = 0;
    let distanceTotale = 0;
    const parCamionMap = {};

    for (const trajet of trajets) {
        const distance = Math.max(0, (trajet.kmArrivee || 0) - (trajet.kmDepart || 0));
        const volume = Number(trajet.volumeGasoil) || 0;

        volumeTotalGasoil += volume;
        distanceTotale += distance;

        if (trajet.camion) {
            const camionId = trajet.camion._id.toString();
            if (!parCamionMap[camionId]) {
                parCamionMap[camionId] = {
                    camion: {
                        id: trajet.camion._id,
                        matricule: trajet.camion.matricule,
                        marque: trajet.camion.marque,
                        modele: trajet.camion.modele
                    },
                    nombreTrajets: 0,
                    distanceTotale: 0,
                    volumeGasoilTotal: 0
                };
            }

            parCamionMap[camionId].nombreTrajets += 1;
            parCamionMap[camionId].distanceTotale += distance;
            parCamionMap[camionId].volumeGasoilTotal += volume;
        }
    }

    const consommationMoyenneFlotte = distanceTotale > 0
        ? Number(((volumeTotalGasoil * 100) / distanceTotale).toFixed(2))
        : 0;

    const parCamion = Object.values(parCamionMap).map((item) => {
        const moyenne = item.distanceTotale > 0
            ? Number(((item.volumeGasoilTotal * 100) / item.distanceTotale).toFixed(2))
            : 0;
        return {
            ...item,
            consommationMoyenne: moyenne
        };
    });

    return {
        volumeTotalGasoil,
        distanceTotale,
        consommationMoyenneFlotte,
        parCamion
    };
};

const getRapportKilometrage = async () => {
    const camions = await Camion.find().select('matricule marque modele kilometrage statut');

    const trajetsTermines = await Trajet.find({ statut: 'termine' })
        .populate('chauffeur', 'nom prenom email')
        .populate('remorque', 'matricule type');

    const chauffeursMap = {};
    const remorquesMap = {};

    for (const trajet of trajetsTermines) {
        const distance = Math.max(0, (trajet.kmArrivee || 0) - (trajet.kmDepart || 0));

        if (trajet.chauffeur) {
            const chauffeurId = trajet.chauffeur._id.toString();
            if (!chauffeursMap[chauffeurId]) {
                chauffeursMap[chauffeurId] = {
                    chauffeur: {
                        id: trajet.chauffeur._id,
                        nom: trajet.chauffeur.nom,
                        prenom: trajet.chauffeur.prenom,
                        email: trajet.chauffeur.email
                    },
                    nombreTrajets: 0,
                    kmTotal: 0
                };
            }
            chauffeursMap[chauffeurId].nombreTrajets += 1;
            chauffeursMap[chauffeurId].kmTotal += distance;
        }

        if (trajet.remorque) {
            const remorqueId = trajet.remorque._id.toString();
            if (!remorquesMap[remorqueId]) {
                remorquesMap[remorqueId] = {
                    remorque: {
                        id: trajet.remorque._id,
                        matricule: trajet.remorque.matricule,
                        type: trajet.remorque.type
                    },
                    nombreTrajets: 0,
                    kmTotal: 0
                };
            }
            remorquesMap[remorqueId].nombreTrajets += 1;
            remorquesMap[remorqueId].kmTotal += distance;
        }
    }

    return {
        camions,
        chauffeurs: Object.values(chauffeursMap),
        remorques: Object.values(remorquesMap)
    };
};

const getRapportMaintenance = async () => {
    const camionsEnMaintenance = await Camion.find({ statut: 'maintenance' })
        .select('matricule marque modele kilometrage');

    const pneusEnAlerte = await Pneu.find({ statut: 'alerte_remplacement' })
        .populate('camion', 'matricule marque')
        .select('numeroSerie marque dimension kmUsure seuilMaxKm position camion');

    const interventions = await MaintenanceIntervention.find()
        .populate('camion', 'matricule marque modele')
        .populate('regle', 'nom type seuilKm')
        .sort({ dateIntervention: -1 });

    let coutTotal = 0;
    for (const intervention of interventions) {
        coutTotal += Number(intervention.cout) || 0;
    }

    return {
        camionsEnMaintenance: {
            total: camionsEnMaintenance.length,
            liste: camionsEnMaintenance
        },
        pneusEnAlerte: {
            total: pneusEnAlerte.length,
            liste: pneusEnAlerte
        },
        interventions: {
            total: interventions.length,
            coutTotal,
            historique: interventions
        }
    };
};

module.exports = {
    getRapportConsommation,
    getRapportKilometrage,
    getRapportMaintenance
};
