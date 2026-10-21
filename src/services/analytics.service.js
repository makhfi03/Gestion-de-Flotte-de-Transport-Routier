const Trajet = require('../models/Trajet');

const getEcoPerformance = async () => {
    const [result] = await Trajet.aggregate([
        {
            $match: {
                statut: 'termine',
                kmDepart: { $ne: null },
                kmArrivee: { $ne: null },
                volumeGasoil: { $ne: null }
            }
        },
        {
            $project: {
                chauffeur: 1,
                distance: { $subtract: ['$kmArrivee', '$kmDepart'] },
                volumeGasoil: 1
            }
        },
        {
            $match: {
                distance: { $gt: 0 }
            }
        },
        {
            $group: {
                _id: '$chauffeur',
                totalTrajets: { $sum: 1 },
                totalDistance: { $sum: '$distance' },
                totalGasoil: { $sum: '$volumeGasoil' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'chauffeur'
            }
        },
        {
            $unwind: '$chauffeur'
        },
        {
            $project: {
                _id: 0,
                chauffeurId: '$_id',
                nom: '$chauffeur.nom',
                prenom: '$chauffeur.prenom',
                email: '$chauffeur.email',
                totalTrajets: 1,
                totalDistanceKm: { $round: ['$totalDistance', 2] },
                totalGasoilLitres: { $round: ['$totalGasoil', 2] },
                consommationMoyenne: {
                    $round: [
                        { $multiply: [{ $divide: ['$totalGasoil', '$totalDistance'] }, 100] },
                        2
                    ]
                }
            }
        },
        {
            $project: {
                chauffeurId: 1,
                nom: 1,
                prenom: 1,
                email: 1,
                totalTrajets: 1,
                totalDistanceKm: 1,
                totalGasoilLitres: 1,
                consommationMoyenne: 1,
                scoreEcoConduite: {
                    $round: [
                        {
                            $max: [
                                0,
                                {
                                    $min: [
                                        100,
                                        {
                                            $subtract: [
                                                100,
                                                {
                                                    $multiply: [
                                                        { $subtract: ['$consommationMoyenne', 30] },
                                                        2.5
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        2
                    ]
                }
            }
        },
        {
            $facet: {
                classement: [
                    { $sort: { scoreEcoConduite: -1 } }
                ],
                statistiquesGlobales: [
                    {
                        $group: {
                            _id: null,
                            totalChauffeurs: { $sum: 1 },
                            moyenneScoreFlotte: { $avg: '$scoreEcoConduite' },
                            consommationMoyenneFlotte: { $avg: '$consommationMoyenne' },
                            totalDistanceFlotte: { $sum: '$totalDistanceKm' },
                            totalGasoilFlotte: { $sum: '$totalGasoilLitres' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalChauffeurs: 1,
                            moyenneScoreFlotte: { $round: ['$moyenneScoreFlotte', 2] },
                            consommationMoyenneFlotte: { $round: ['$consommationMoyenneFlotte', 2] },
                            totalDistanceFlotte: { $round: ['$totalDistanceFlotte', 2] },
                            totalGasoilFlotte: { $round: ['$totalGasoilFlotte', 2] }
                        }
                    }
                ]
            }
        }
    ]);
    return {
        statistiquesGlobales: result?.statistiquesGlobales[0] || null,
        classement: result?.classement || []
    };
};
module.exports = {
    getEcoPerformance
};