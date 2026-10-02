const User = require('../models/User');
const { verifyAccessToken } = require('../utils/token');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Accès refusé. Aucun token fourni.'
            });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            return res.status(401).json({
                message: 'Token invalide ou expiré.'
            });
        }

        const user = await User.findById(decoded.id).select('-motDePasse');

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur introuvable.'
            });
        }

        if (user.statut === 'suspendu') {
            return res.status(403).json({
                message: 'Accès refusé. Votre compte est suspendu.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const authorize = (...roles) => {
    const allowedRoles = roles.flat();
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Accès refusé. Permissions insuffisantes.'
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};