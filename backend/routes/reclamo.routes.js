const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const {
    reclamosGetAll,
    reclamoPost
} = require('../controllers/reclamo.controller');

const { check, param, body } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    validarCampos,
    check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,
    check('UsuarioId', 'El UsuarioId es obligatorio').not().isEmpty(),
    validarCampos,
    check('PublicacionId', 'La PublicacionId es obligatoria').not().isEmpty(),
    validarCampos,
    // check('documento', 'Los apellidos son obligatorios').not().isEmpty(),
    // check('mensajeAdmin', 'Los apellidos son obligatorios').not().isEmpty(),
], reclamoPost);


router.get('/', [
], reclamosGetAll)


// router.get('/correo/:correo', [
//     param('correo', 'El correo es obligatorio').not().isEmpty(),
//     param('correo', 'El campo enviado no es un correo').isEmail().normalizeEmail(),
//     validarCampos
// ], existeCorreo)

module.exports = router;