const Trajet = require('../models/Trajet');

const getFinancialEsgReport = async (startDate, endDate) => {
    const matchFilter = {
        statut: 'termine',
        kmDepart: { $ne: null },
        kmArrivee: { $ne: null },
        volumeGasoil: { $ne: null }
    };

    if (startDate || endDate) {
        matchFilter.dateDebut = {};
        if (startDate) matchFilter.dateDebut.$gte = new Date(startDate);
        if (endDate) matchFilter.dateDebut.$lte = new Date(endDate);
    }

    const [result] = await Trajet.aggregate([
        {
            $match: matchFilter
        },
        {
            $project: {
                ligne: { $concat: ['$siteDepart', ' -> ', '$siteArrivee'] },
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
                _id: '$ligne',
                totalTrajets: { $sum: 1 },
                totalDistance: { $sum: '$distance' },
                totalGasoil: { $sum: '$volumeGasoil' }
            }
        },
        {
            $project: {
                _id: 0,
                ligne: '$_id',
                totalTrajets: 1,
                totalDistanceKm: { $round: ['$totalDistance', 2] },
                totalGasoilLitres: { $round: ['$totalGasoil', 2] },
                consommationAux100Km: {
                    $round: [
                        { $multiply: [{ $divide: ['$totalGasoil', '$totalDistance'] }, 100] },
                        2
                    ]
                },
                emissionsCO2Tonnes: {
                    $round: [
                        { $divide: [{ $multiply: ['$totalGasoil', 2.68] }, 1000] },
                        3
                    ]
                },
                coutCarburantMAD: {
                    $round: [{ $multiply: ['$totalGasoil', 13] }, 2]
                },
                revenuEstimeMAD: {
                    $round: [{ $multiply: ['$totalDistance', 25] }, 2]
                },
                margeBruteMAD: {
                    $round: [
                        {
                            $subtract: [
                                { $multiply: ['$totalDistance', 25] },
                                { $multiply: ['$totalGasoil', 13] }
                            ]
                        },
                        2
                    ]
                }
            }
        },
        {
            $facet: {
                lignes: [
                    { $sort: { margeBruteMAD: -1 } }
                ],
                bilanGlobal: [
                    {
                        $group: {
                            _id: null,
                            totalLignes: { $sum: 1 },
                            totalTrajets: { $sum: '$totalTrajets' },
                            totalDistanceKm: { $round: [{ $sum: '$totalDistanceKm' }, 2] },
                            totalGasoilLitres: { $round: [{ $sum: '$totalGasoilLitres' }, 2] },
                            totalEmissionsCO2Tonnes: { $round: [{ $sum: '$emissionsCO2Tonnes' }, 3] },
                            coutTotalCarburantMAD: { $round: [{ $sum: '$coutCarburantMAD' }, 2] },
                            revenuTotalMAD: { $round: [{ $sum: '$revenuEstimeMAD' }, 2] },
                            margeBruteTotaleMAD: { $round: [{ $sum: '$margeBruteMAD' }, 2] }
                        }
                    },
                    {
                        $project: {
                            _id: 0
                        }
                    }
                ]
            }
        }
    ]);

    return {
        bilanGlobal: result?.bilanGlobal[0] || null,
        lignes: result?.lignes || []
    };
};

module.exports = {
    getFinancialEsgReport
};