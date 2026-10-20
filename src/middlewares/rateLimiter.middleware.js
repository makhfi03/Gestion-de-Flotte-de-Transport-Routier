const { rateLimit, MemoryStore } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { client } = require('../config/redis');

const memoryStore = new MemoryStore();

const getStore = (prefix) => {
    const redisStore = new RedisStore({
        sendCommand: (...args) => client.sendCommand(args),
        prefix
    });

    return {
        init: (options) => memoryStore.init(options),
        increment: async (key) => {
            if (client.isOpen) {
                try {
                    return await redisStore.increment(key);
                } catch {
                    return memoryStore.increment(key);
                }
            }
            return memoryStore.increment(key);
        },
        decrement: (key) => memoryStore.decrement(key),
        resetKey: (key) => memoryStore.resetKey(key)
    };
};

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    store: getStore('rl:auth:'),
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Trop de tentatives de connexion (10 max par 15 min).'
    }
});

const standardLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    store: getStore('rl:std:'),
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Limite de requêtes atteinte (120 max par minute).'
    }
});

const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    store: getStore('rl:analytics:'),
    message: {
        status: 'error',
        statusCode: 429,
        message: 'Limite de requêtes analytics atteinte (20 max par minute).'
    }
});

module.exports = {
    authLimiter,
    standardLimiter,
    analyticsLimiter
};