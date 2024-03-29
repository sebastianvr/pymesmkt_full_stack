const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const {
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    usuariosGetAll,
    usuariosGetAllSuspended,
    usuarioActivatePut,
    usuarioSuspended,
    usuariosGetAllDeleted,
    suspendUser,
} = require('../controllers/usuario.controller');

const { check, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',
    [
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ],
    usuariosGetAll
);

router.get('/suspended/',
    [
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ]
    ,
    usuariosGetAllSuspended
);

router.get('/deleted/',
    [
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ],
    usuariosGetAllDeleted
);

router.get('/:id', usuarioGet);

router.post('/', [
    check('nombreUsuario', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    validarCampos,
    check('run', 'El run es obligatorio').not().isEmpty(),
    check('run', ''),
    validarCampos,
    check('emailUsuario', 'El correo es obligatorio').not().isEmpty(),
    check('emailUsuario', 'El correo no es válido').isEmail().normalizeEmail(),
    validarCampos,
], usuarioPost);

router.put('/:id', [
    check('id', 'El param id es obligatorio').not().isEmpty(), 
    validarCampos,
], usuarioPut);

router.put('/activate/:id', validarCampos, usuarioActivatePut);

router.delete('/suspended/:id', [
    check('id', 'El param id es obligatorio').not().isEmpty(),

    // validarJWT,
    validarCampos
], usuarioSuspended);

router.delete('/delete/:id', [
    check('id', 'El param id es obligatorio').not().isEmpty(),
    // validarJWT,
    validarCampos
], usuarioDelete);

router.put('/suspend/:id', [
    check('id', 'El param id es obligatorio').not().isEmpty(),
    // validarJWT,
    validarCampos
], suspendUser);

module.exports = router;