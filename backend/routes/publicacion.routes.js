const { Router } = require('express');
const { check, param, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
    publicacionPost,
    publicacionesGetAll,
    publicacionDelete,
    publicacionGet,
    publicacionesGet,
    publicacionPagada,
    publicacionesCompradas,
    publicacionesFilterQuery
} = require('../controllers/publicacion.controller');
const { uid } = require('uid');


const router = Router();

router.get('/', publicacionesGetAll);

router.get(
    '/query',
    [
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),

        query('id')
            .optional()
            .custom((value) => {
                const uuidRegex = /^[0-9a-fA-F]{15}$/;
                if (!uuidRegex.test(value)) {
                    throw new Error('El ID no es válido');
                }
                return true;
            })
            .withMessage('El ID proporcionado no es válido'),
        query('titulo').optional().isString()
            .withMessage('El campo "titulo" debe ser una cadena (string)'),
        query('cantidadOfertasRecibidas').optional().isInt({ min: 0 }).
            withMessage('cantidadOfertasRecibidas debe ser un número entero'),
        query('precioTotal').optional().isInt({ min: 1 }).
            withMessage('precioTotal debe ser un número entero'),
        query('garantia').optional().isBoolean().
            withMessage('garantia debe ser un valor booleano'),
        query('productoOServicio').optional().isIn(['PRODUCTO', 'SERVICIO']).
            withMessage('productoOServicio debe ser PRODUCTO o SERVICIO'),
    ],
    publicacionesFilterQuery
);

router.get('/:id', publicacionGet);

router.get('/usuario/:idUsuario',
    [
        param('idUsuario')
            .notEmpty().withMessage('El parámetro idUsuario es obligatorio')
            .custom((value) => {
                const uuidRegex = /^[0-9a-fA-F]{15}$/;
                if (!uuidRegex.test(value)) {
                    throw new Error('El ID no es válido');
                }
                return true;
            })
            .withMessage('El ID proporcionado no es válido'),

        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
        query('titulo').optional().isString()
            .withMessage('El campo "titulo" debe ser una cadena (string)'),
    ],
    publicacionesGet
);

// Ruta para obtener todas las publicaciones de un usuario en especifico
router.get('/usuario/paid/:idUsuario', publicacionesCompradas);

router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    validarCampos,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos,
], publicacionPost);

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