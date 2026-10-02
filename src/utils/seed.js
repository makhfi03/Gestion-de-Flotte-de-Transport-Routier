require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB pour le seed...');

        // Nettoyer les utilisateurs existants pour repartir sur une base propre
        await User.deleteMany({});

        const users = [
            {
                nom: 'Directeur',
                prenom: 'Admin',
                email: 'admin@flotte.com',
                motDePasse: 'Admin123!',
                role: 'admin',
                statut: 'actif',
                telephone: '0600000001'
            },
            {
                nom: 'Alami',
                prenom: 'Mohamed',
                email: 'chauffeur@flotte.com',
                motDePasse: 'Chauffeur123!',
                role: 'chauffeur',
                statut: 'actif',
                telephone: '0600000002'
            },
            {
                nom: 'Benani',
                prenom: 'Karim',
                email: 'suspendu@flotte.com',
                motDePasse: 'Chauffeur123!',
                role: 'chauffeur',
                statut: 'suspendu',
                telephone: '0600000003'
            }
        ];

        for (const u of users) {
            await User.create(u);
        }

        console.log('✅ 3 utilisateurs créés avec succès : Admin, Chauffeur Actif, Chauffeur Suspendu');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors du seed :', error);
        process.exit(1);
    }
};

seedUsers();
