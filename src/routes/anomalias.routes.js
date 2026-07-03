const express = require('express');
const router = express.Router();
const controller = require('../controllers/anomalias.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, controller.getAnomalias);

module.exports = router;

// En tu app.js / index.js principal, agrega:
 
