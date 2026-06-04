const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

console.log("updateUsuario:", controller.updateUsuario);
console.log("authMiddleware:", authMiddleware);
console.log("deleteUsuario:", controller.deleteUsuario);

router.post('/upload-photo', authMiddleware, upload.single('photo'), controller.uploadPhoto);
router.get('/me', authMiddleware, controller.getProfile);
router.put('/:id', authMiddleware, controller.updateUsuario);
router.delete('/:id', authMiddleware, controller.deleteUsuario);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/', authMiddleware, controller.createUsuarioByAdmin);
router.get('/', authMiddleware, controller.getUsuarios);
console.log("deleteUsuario:", controller.deleteUsuario);
console.log("authMiddleware:", authMiddleware);


module.exports = router;