const { Router } = require('express');
const { check, param } = require('express-validator');
const { calificacionPost } = require('../controllers/calificacion.controller');


const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



// Creacion de un nuevo reclamo
router.post('/', [
    check('reseña', 'La reseña es obligatoria').not().isEmpty(),
    validarCampos,

    check('puntaje', 'La calificación es obligatoria').not().isEmpty(),
    validarCampos,
], calificacionPost);

// // Eliminacion de una publicacion
// router.delete('/:id', [
//     param('id', 'El param id es obligatorio').not().isEmpty(),
//     validarCampos
// ], publicacionDelete);

// // cambia el estado de la publicacion a procesoDePublicacion :  FINALIZADA
// router.put('/aceptar/:id', [
//     param('id', 'El param id es obligatorio').not().isEmpty(),
//     validarCampos
// ], publicacionPagada);

module.exports = router;