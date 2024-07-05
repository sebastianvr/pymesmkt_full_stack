const { Router } = require('express');
const { check, query } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const {
    reclamosGetAll,
    reclamoPost,
    reclamoUpdateAdminMessage,
    reclamosFinishedGetAll
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
    validarJWT,
    query('page').optional().isInt({ min: 1 }).
        withMessage('page debe ser un número entero mayor o igual a 1'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).
        withMessage('pageSize debe ser un número entero entre 1 y 100'),
    query('nombre').optional().isString()
        .withMessage('El campo "nombre" debe ser una cadena (string)'),
    query('fecha').optional()
        .custom((value) => {
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(value)) {
                throw new Error('La fecha no es válida. Debe estar en formato DD-MM-YYYY');
            }
            return true;
        })
        .withMessage('La fecha proporcionada no es válida'),
], reclamosGetAll)

router.get('/finished', [
    validarJWT,
    query('page').optional().isInt({ min: 1 }).
        withMessage('page debe ser un número entero mayor o igual a 1'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).
        withMessage('pageSize debe ser un número entero entre 1 y 100'),
    query('nombre').optional().isString()
        .withMessage('El campo "nombre" debe ser una cadena (string)'),
    query('fecha').optional()
        .custom((value) => {
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(value)) {
                throw new Error('La fecha no es válida. Debe estar en formato DD-MM-YYYY');
            }
            return true;
        })
        .withMessage('La fecha proporcionada no es válida'),
], reclamosFinishedGetAll)

router.put('/:id/admin-message/', [
    validarJWT,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('mensajeAdmin', 'El mensaje del admin es obligatorio').not().isEmpty(),
    validarCampos,
], reclamoUpdateAdminMessage);

module.exports = router;