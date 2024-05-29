const { Router } = require('express');
const { check, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    compraPost,
    dataGraphGet,
    comprasGetById
} = require('../controllers/compra.controller');

const router = Router();

router.get('/graph/', validarJWT, dataGraphGet);

// Ruta para buscar todas las compras por id del usuario
router.get('/usuario/:UsuarioId', [
    validarJWT,
    query('page').optional().isInt({ min: 1 }).
        withMessage('page debe ser un número entero mayor o igual a 1'),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).
        withMessage('pageSize debe ser un número entero entre 1 y 100'),
    check('UsuarioId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos,
    query('empresa').optional().isString()
    .withMessage('El campo "empresa" debe ser una cadena (string)'),
], comprasGetById);

// Creación de nueva compra
router.post('/', [
    validarJWT,
    check('PublicacionId', 'El id de la publicación es obligatorio').not().isEmpty(),
    validarCampos,
    check('UsuarioId', 'El del usuario es obligatorio').not().isEmpty(),
    validarCampos,
    check('OfertumId', 'El id de la oferta es obligatorio').not().isEmpty(),
    validarCampos,
    check('precio', 'El precio de la compra es obligatorio').not().isEmpty(),
    validarCampos,
    check('codAutorizacion', 'El codigo de autorizacion es obligatorio').not().isEmpty(),
    validarCampos,
], compraPost);

module.exports = router;