const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificaciones.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, controller.getNotificaciones);

module.exports = router;