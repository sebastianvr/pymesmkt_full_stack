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

const { check, param, body, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', usuariosGetAll);

router.get('/suspended/', usuariosGetAllSuspended);

router.get('/deleted/', usuariosGetAllDeleted);

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

router.put('/:id', validarCampos, usuarioPut);

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