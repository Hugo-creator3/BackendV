const express = require('express');
const router = express.Router();

const controller = require('../controllers/reportes.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, controller.enviarReporte);

module.exports = router;