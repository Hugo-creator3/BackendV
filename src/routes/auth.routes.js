const express = require('express')
const router = express.Router()

const auth = require('../controllers/auth.controller')

router.post('/empresa', auth.crearEmpresa)

router.post('/register', auth.registrarAdmin)

router.post('/login', auth.login)

router.post('/send-code', auth.enviarCodigoRegistro)

router.post('/verify-code', auth.verificarCodigoYRegistrar)

module.exports = router