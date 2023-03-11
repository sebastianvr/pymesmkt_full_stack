const { Router } = require('express');
const { check, param } = require('express-validator');

const { ofertaDelete,
    ofertaPost,
    ofertaPut,
    ofertasRecibidasGetById,
    ofertasCreadasGetById,
    ofertaGetById,
    ofertaPagada,
} = require('../controllers/oferta.controller');


const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Ruta para obtener todas las ofertas recibidas
router.get('/received/:UsuarioId', ofertasRecibidasGetById);

// Ruta para obtener todas las ofertas creadas 
router.get('/created/:UsuarioId', ofertasCreadasGetById);

router.get('/:IdOferta', [
    param('IdOferta', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], ofertaGetById);


// Ruta para buscar una publicacion por id 
// router.get('/:id', ofertaGet);

// Ruta para obtener todas las publicaciones de un usuario en especifico
// router.get('/usuario/:idUsuario', publicacionesGet);


// Creacion de una nueva publicacion
router.post('/', [
    check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,

    check('precioOferta', 'El precio de oferta es obligatorio').not().isEmpty(),
    validarCampos,

    check('PublicacionId', 'El id de la publicación es obligatorio').not().isEmpty(),
    validarCampos,

    check('UsuarioId', 'El del usuario es obligatorio').not().isEmpty(),
    validarCampos,

], ofertaPost);

// Eliminacion de una publicacion
router.delete('/:id', [
    param('id', 'El param id es obligatorio').not().isEmpty(),

    // validarJWT, 
    validarCampos
], ofertaDelete);

// cambia el estado de la publicacion a procesoDePublicacion :  FINALIZADA
router.put('/aceptar/:id', [
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], ofertaPagada);


module.exports = router;