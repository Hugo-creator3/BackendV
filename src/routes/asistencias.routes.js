const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistencias.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, controller.getAsistencias);
router.get('/me', auth, controller.getMyAsistencias);

module.exports = router;