const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token');

class AuthService {
    async login(email, motDePasse) {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(motDePasse)))  {
            const error = new Error('Identifiants incorrects');
            error.statusCode = 401;
            throw error;
        }

        if (user.statut === 'suspendu') {
            const error = new Error('Votre compte est suspendu. Connexion refusée.');
            error.statusCode = 403;
            throw error;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return {
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
                statut: user.statut
            },
            accessToken,
            refreshToken
        };
    }

    async refresh(refreshToken) {
        try {
            const decoded = verifyRefreshToken(refreshToken);

            const user = await User.findById(decoded.id);
            if (!user) {
                const error = new Error('Utilisateur non trouvé');
                error.statusCode = 404;
                throw error;
            }

            if (user.statut === 'suspendu') {
                const error = new Error('Votre compte est suspendu.');
                error.statusCode = 403;
                throw error;
            }

            const accessToken = generateAccessToken(user);
            return { accessToken };
        } catch (err) {
            const error = new Error(err.message || 'Refresh token invalide ou expiré');
            error.statusCode = err.statusCode || 401;
            throw error;
        }
    }
}

module.exports = new AuthService();