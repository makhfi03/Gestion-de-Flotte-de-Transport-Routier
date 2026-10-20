const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URI || 'redis://127.0.0.1:6379'
});

client.on('connect', () => {
    console.log('Redis Connecté');
});

client.on('error', () => {
    console.log('Redis non disponible (mode fallback)');
});

const connectRedis = async () => {
    try {
        await client.connect();
    } catch {
        console.log('Connexion Redis échouée, fallback mémoire actif');
    }
};

module.exports = { client, connectRedis };