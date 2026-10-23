const Pneu = require('../models/Pneu');

const getTiresHealthMatrix = async () => {
    const matrix = await Pneu.aggregate([
        {
            $match: {
                statut: { $ne: 'remplace' },
                position: { $ne: 'non_installe' }
            }
        },
        {
            $addFields: {
                remainingKm: {
                    $max: [
                        0,
                        {
                            $subtract: [
                                { $ifNull: ['$seuilMaxKm', 80000] },
                                { $ifNull: ['$kmUsure', 0] }
                            ]
                        }
                    ]
                }
            }
        },
        {
            $addFields: {
                isCritical: {
                    $or: [
                        { $lt: ['$remainingKm', 5000] },
                        { $lte: [{ $ifNull: ['$profondeurSculpture', 8] }, 3] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$position',
                nombrePneus: { $sum: 1 },
                kilometrageMoyen: { $round: [{ $avg: '$kmUsure' }, 2] },
                nombrePneusCritiques: {
                    $sum: { $cond: ['$isCritical', 1, 0] }
                },
                budgetEstime: {
                    $multiply: [
                        { $sum: { $cond: ['$isCritical', 1, 0] } },
                        3800
                    ]
                }
            }
        },
        {
            $project: {
                _id: 0,
                position: '$_id',
                nombrePneus: 1,
                kilometrageMoyen: 1,
                nombrePneusCritiques: 1,
                budgetEstime: 1
            }
        },
        {
            $sort: { position: 1 }
        }
    ]);

    return matrix;
};

module.exports = {
    getTiresHealthMatrix
};