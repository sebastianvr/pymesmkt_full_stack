const { Router } = require('express');
const { check, param } = require('express-validator');
const { publicacionPost, publicacionesGetAll, publicacionDelete, publicacionGet, publicacionesGet, publicacionPagada, publicacionesCompradas } = require('../controllers/publicacion.controller');


const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Ruta para obtener todas las publicaciones
router.get('/', publicacionesGetAll);

// Ruta para buscar una publicacion por id 
router.get('/:id', publicacionGet);

// Ruta para obtener todas las publicaciones de un usuario en especifico
router.get('/usuario/:idUsuario', publicacionesGet);

// Ruta para obtener todas las publicaciones de un usuario en especifico
router.get('/usuario/paid/:idUsuario', publicacionesCompradas);

// Creacion de una nueva publicacion
router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    validarCampos,

    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos,

], publicacionPost);

// Eliminacion de una publicacion
router.delete('/:id', [
    param('id', 'El param id es obligatorio').not().isEmpty(),
    // validarJWT, 
    validarCampos
], publicacionDelete);

// cambia el estado de la publicacion a procesoDePublicacion :  FINALIZADA
router.put('/aceptar/:id', [
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], publicacionPagada);

module.exports = router;