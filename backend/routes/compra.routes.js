const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const {
    compraPost,
    dataGraphGet,
    comprasGetById
} = require('../controllers/compra.controller');



const router = Router();
router.get('/graph/', dataGraphGet);

// Ruta para buscar todas las compras por id del usuario
router.get('/usuario/:UsuarioId', [
    check('UsuarioId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos,
], comprasGetById);

// Creacion de una nueva compra
router.post('/', [
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