const { Router } = require('express');
const { check } = require('express-validator');

const { login, revalidarToken } = require('../controllers/login.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login', [
    check('emailUsuario', 'El correo es obligatorio').not().isEmpty(),
    check('emailUsuario', 'No es un correo válido').isEmail(),
    validarCampos,
    
    check('contrasenia', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,

], login);

router.get('/renew', validarJWT, revalidarToken)

module.exports = router;