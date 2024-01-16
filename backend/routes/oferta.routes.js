const { Router } = require('express');
const { check, param, query } = require('express-validator');

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
router.get('/received/:idUsuario',
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
    ],
    ofertasRecibidasGetById
);

// Ruta para obtener todas las ofertas creadas 
router.get('/created/:UsuarioId',
    [
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
    check('UsuarioId', 'El id del usuario es obligatorio').not().isEmpty(),
    validarCampos,

    check('usuarioIdReceptor', 'El del usuarioIdReceptor es obligatorio').not().isEmpty(),
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