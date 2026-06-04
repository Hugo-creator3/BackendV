const express = require('express')
const router = express.Router()

const controller = require('../controllers/tarjeta.controller')
const auth = require('../middlewares/auth.middleware')

router.get('/', auth, controller.obtenerDiseno)

router.post('/', auth, controller.guardarDiseno)

module.exports = router