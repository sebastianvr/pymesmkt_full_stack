const { Router } = require('express');
const multer = require('multer');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    signInPost,
    existeCorreo,
    existeRun,
    existeRut,
} = require('../controllers/sign-in.controller');

const { check, param, body } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', [
    check('nombreUsuario', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    validarCampos,
    check('run', 'El run es obligatorio').not().isEmpty(),
    validarCampos,
    check('emailUsuario', 'El correo es obligatorio').not().isEmpty(),
    check('emailUsuario', 'El correo no es válido').isEmail().normalizeEmail(),
    validarCampos,
], signInPost);


router.get('/run/:run', [
    param('run', 'El run es obligatorio').not().isEmpty(),
    validarCampos,
], existeRun);


router.get('/correo/:correo', [
    param('correo', 'El correo es obligatorio').not().isEmpty(),
    param('correo', 'El campo enviado no es un correo').isEmail().normalizeEmail(),
    validarCampos,
], existeCorreo);

module.exports = router;