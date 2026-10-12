const rapportService = require('../services/rapport.service');

const getConsommation = async (req, res, next) => {
    try {
        const data = await rapportService.getRapportConsommation();

        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getKilometrage = async (req, res, next) => {
    try {
        const data = await rapportService.getRapportKilometrage();

        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

const getMaintenance = async (req, res, next) => {
    try {
        const data = await rapportService.getRapportMaintenance();

        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getConsommation,
    getKilometrage,
    getMaintenance
};
