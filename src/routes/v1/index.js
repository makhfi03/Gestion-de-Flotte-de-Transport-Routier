const express = require('express');
const router = express.Router();

const authRoutes = require('../auth.routes');
const chauffeurRoutes = require('../chauffeur.routes');
const camionRoutes = require('../camion.routes');
const remorqueRoutes = require('../remorque.routes');
const pneuRoutes = require('../pneu.routes');
const trajetRoutes = require('../trajet.routes');
const chauffeurTrajetRoutes = require('../chauffeurTrajet.routes');
const maintenanceRoutes = require('../maintenance.routes');
const rapportRoutes = require('../rapport.routes');

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API v1 opérationnelle' });
});

router.use('/auth', authRoutes);
router.use('/chauffeurs', chauffeurRoutes);
router.use('/camions', camionRoutes);
router.use('/remorques', remorqueRoutes);
router.use('/pneus', pneuRoutes);
router.use('/trajets', trajetRoutes);
router.use('/chauffeur/trajets', chauffeurTrajetRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/rapports', rapportRoutes);

module.exports = router;