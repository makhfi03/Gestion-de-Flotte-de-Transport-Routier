require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const chauffeurRoutes = require('./routes/chauffeur.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API Gestion de Flotte opérationnelle' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);

app.use(errorHandler);

module.exports = app;