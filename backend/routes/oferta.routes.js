const { Router } = require('express');
const { check, param, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { ofertaDelete,
    ofertaPost,
    ofertaPut,
    ofertasRecibidasGetById,
    ofertasCreadasGetById,
    ofertaGetById,
    getVentas,
} = require('../controllers/oferta.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener todas las ofertas recibidas
router.get('/received/:idUsuario',
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
        query('pyme').optional().isString()
            .withMessage('El campo "pyme" debe ser una cadena (string)'),
    ],
    ofertasRecibidasGetById
);

// Obtener todas las ofertas creadas 
router.get('/created/:UsuarioId',
    [
        validarJWT,
        param('UsuarioId')
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
        query('pyme').optional().isString()
            .withMessage('El campo "pyme" debe ser una cadena (string)'),
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
    ofertasCreadasGetById
);

router.get('/:IdOferta', [
    validarJWT,
    param('IdOferta', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], ofertaGetById);

router.post('/', [
    validarJWT,
    check('mensaje', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,
    check('precioOferta', 'El precio de oferta es obligatorio').not().isEmpty(),
    validarCampos,
    check('PublicacionId', 'El id de la publicación es obligatorio').not().isEmpty(),
    validarCampos,
    check('UsuarioId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos,
    check('usuarioIdReceptor', 'El del usuarioIdReceptor es obligatorio').not().isEmpty(),
    validarCampos,
], ofertaPost);

router.delete('/:id', [
    validarJWT,
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], ofertaDelete);

router.get('/pagada/:UsuarioId', [
    validarJWT,
    param('UsuarioId')
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
    query('mensaje').optional().isString()
        .withMessage('El campo "mensaje" debe ser una cadena (string)'),
    query('fecha').optional()
        .custom((value) => {
            const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(value)) {
                throw new Error('La fecha no es válida. Debe estar en formato DD-MM-YYYY');
            }
            return true;
        })
        .withMessage('La fecha proporcionada no es válida'),
], getVentas);

module.exports = router;