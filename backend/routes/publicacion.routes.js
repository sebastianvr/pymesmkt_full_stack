const { Router } = require('express');
const { check, param, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
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


const router = Router();

router.get('/', validarJWT, publicacionesGetAll);

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

router.get('/:id', validarJWT, publicacionGet);

router.get('/usuario/:idUsuario',
    [
        validarJWT,
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
        query('fecha').optional()
            .custom((value) => {
                const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
                if (!dateRegex.test(value)) {
                    throw new Error('La fecha no es válida. Debe estar en formato DD-MM-YYYY');
                }
                return true;
            })
            .withMessage('La fecha proporcionada no es válida'),
    ],
    publicacionesGet
);

// Obtener todas las publicaciones de un usuario en especifico
router.get('/usuario/paid/:idUsuario', validarJWT, publicacionesCompradas);

router.post('/', [
    validarJWT,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    validarCampos,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos,
], publicacionPost);

router.delete('/:id', [
    validarJWT,
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], publicacionDelete);

// Cambia el estado de la publicación -> procesoDePublicacion :  FINALIZADA
router.put('/aceptar/:id', [
    validarJWT,
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], publicacionPagada);

module.exports = router;