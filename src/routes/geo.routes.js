const express = require('express')
const router = express.Router()

const controller = require('../controllers/geo.controller')
const auth = require('../middlewares/auth.middleware')

router.post('/validate', auth, controller.validateLocation)
router.get('/', auth, controller.getConfig)
router.post('/', auth, controller.saveConfig)

module.exports = router