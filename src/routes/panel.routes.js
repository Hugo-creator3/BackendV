const express = require('express');
const router = express.Router();

const panelController = require('../controllers/panel.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 👇 panel básico (mensaje + institución)
router.get('/', authMiddleware, panelController.panel);
router.get('/admins',authMiddleware,panelController.getAdmins);

// 👇 dashboard métricas
router.get('/dashboard', authMiddleware, panelController.getDashboard);
router.get('/usuarios-estadisticas', authMiddleware, panelController.getEstadisticasUsuarios);

module.exports = router;
