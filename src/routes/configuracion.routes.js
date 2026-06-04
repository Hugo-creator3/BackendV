const express = require('express');
const router = express.Router();

const controller = require('../controllers/configuracion.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, controller.getConfiguracion);

router.post('/', auth, controller.saveConfiguracion);

module.exports = router;