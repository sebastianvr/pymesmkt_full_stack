const { Router } = require('express');
const { check } = require('express-validator');

const { compraPost, dataGraphGet, comprasGetById } = require('../controllers/compra.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Ruta para obtener data para graficar con d3
router.get('/graph/', dataGraphGet);

// Ruta para obtener todas las publicaciones creadas 
// router.get('/created/:UsuarioId', ofertasCreadasGetById);


// Ruta para buscar todas las compras por id del usuario
router.get('/usuario/:UsuarioId', [
    check('UsuarioId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos,
], comprasGetById);

// Ruta para obtener todas las publicaciones de un usuario en especifico
// router.get('/usuario/:idUsuario', publicacionesGet);


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

// Eliminacion de una publicacion
// router.delete('/:id', [
//     param('id', 'El param id es obligatorio').not().isEmpty(),

//     // validarJWT, 
//     validarCampos
// ], ofertaDelete);

module.exports = router;