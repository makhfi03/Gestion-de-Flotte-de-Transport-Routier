const authService = require('../services/auth.service');

const login = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body;
        const result = await authService.login(email, motDePasse);

        return res.status(200).json({
            status: 'success',
            message: 'Connexion réussie',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refresh(refreshToken);

        return res.status(200).json({
            status: 'success',
            message: 'Nouveau token généré avec succès',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
            status: 'success',
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    refresh,
    logout
};