const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { check, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
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

const router = Router();

router.get('/',
    [
        validarJWT,
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ],
    usuariosGetAll
);

router.get('/suspended/',
    [
        validarJWT,
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ],
    usuariosGetAllSuspended
);

router.get('/deleted/',
    [
        validarJWT,
        query('page').optional().isInt({ min: 1 }).
            withMessage('page debe ser un número entero mayor o igual a 1'),
        query('pageSize').optional().isInt({ min: 1, max: 100 }).
            withMessage('pageSize debe ser un número entero entre 1 y 100'),
    ],
    usuariosGetAllDeleted
);

router.get('/:id', validarJWT, usuarioGet);

router.post('/', [
    validarJWT,
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
    validarJWT,
    check('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos,
], usuarioPut);

router.put('/activate/:id', [
    validarJWT,
    validarCampos
], usuarioActivatePut);

router.delete('/suspended/:id', [
    validarJWT,
    check('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], usuarioSuspended);

router.delete('/delete/:id', [
    validarJWT,
    check('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], usuarioDelete);

router.put('/suspend/:id', [
    validarJWT,
    check('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], suspendUser);

module.exports = router;