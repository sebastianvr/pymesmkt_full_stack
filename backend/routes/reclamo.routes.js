const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const {
    reclamosGetAll,
    reclamoPost
} = require('../controllers/reclamo.controller');

const router = Router();

router.post('/', [
    validarJWT,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    validarCampos,
    check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,
    check('UsuarioId', 'El UsuarioId es obligatorio').not().isEmpty(),
    validarCampos,
    check('PublicacionId', 'La PublicacionId es obligatoria').not().isEmpty(),
    validarCampos,
    // check('documento', 'Los apellidos son obligatorios').not().isEmpty(),
], reclamoPost);

router.get('/', [
], reclamosGetAll)

module.exports = router;