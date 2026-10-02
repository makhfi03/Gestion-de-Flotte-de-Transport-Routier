const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const os = require('os');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Authentification Endpoints (US-01)', () => {
    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gestion_flotte?directConnection=true';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri, {
                runtimeAdapters: { os }
            });
        }

        // Nettoyer et réinitialiser les 3 comptes de test
        await User.deleteMany({});
        await User.create([
            {
                nom: 'Directeur',
                prenom: 'Admin',
                email: 'admin@flotte.com',
                motDePasse: 'Admin123!',
                role: 'admin',
                statut: 'actif'
            },
            {
                nom: 'Alami',
                prenom: 'Mohamed',
                email: 'chauffeur@flotte.com',
                motDePasse: 'Chauffeur123!',
                role: 'chauffeur',
                statut: 'actif'
            },
            {
                nom: 'Benani',
                prenom: 'Karim',
                email: 'suspendu@flotte.com',
                motDePasse: 'Chauffeur123!',
                role: 'chauffeur',
                statut: 'suspendu'
            }
        ]);
    }, 15000);

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/auth/login', () => {
        it('devrait rejeter un format d\'email invalide (HTTP 400)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'format-invalide',
                    motDePasse: 'Admin123!'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
        });

        it('devrait rejeter des identifiants erronés (HTTP 401)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@flotte.com',
                    motDePasse: 'FauxMotDePasse!'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toMatch(/Identifiants incorrects/i);
        });

        it('devrait refuser la connexion d\'un chauffeur suspendu (HTTP 403)', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'suspendu@flotte.com',
                    motDePasse: 'Chauffeur123!'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toMatch(/Votre compte est suspendu/i);
        });

        it('devrait connecter avec succès un utilisateur valide (HTTP 200) et renvoyer les tokens', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@flotte.com',
                    motDePasse: 'Admin123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data.user.email).toBe('admin@flotte.com');
            expect(res.body.data.user.role).toBe('admin');
        });
    });

    describe('POST /api/auth/refresh', () => {
        it('devrait générer un nouvel access token avec un refresh token valide (HTTP 200)', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'chauffeur@flotte.com',
                    motDePasse: 'Chauffeur123!'
                });

            const refreshToken = loginRes.body.data.refreshToken;

            const refreshRes = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken });

            expect(refreshRes.statusCode).toBe(200);
            expect(refreshRes.body.data).toHaveProperty('accessToken');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('devrait confirmer la déconnexion (HTTP 200)', async () => {
            const res = await request(app).post('/api/auth/logout');
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toMatch(/Déconnexion réussie/i);
        });
    });
});
