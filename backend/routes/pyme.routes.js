const { Router } = require('express');
const { param } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { pymesGet,
    pymeGet,
    pymePost,
    pymePut,
    pymeDelete } = require('../controllers/pyme.controller');
const { existeRut } = require('../controllers/sign-in.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', validarJWT, pymesGet);

router.get('/:UsuarioId', [
    validarJWT,
    param('UsuarioId', 'El id es obligatorio').not().isEmpty(),
    validarCampos
], pymeGet);

router.post('/', validarJWT, pymePost);

router.put('/:id', validarJWT, pymePut);

router.delete('/:id', validarJWT, pymeDelete);

router.get('/rut/:rut', [
    param('rut', 'El rut es obligatorio').not().isEmpty(),
    validarCampos
], existeRut)

module.exports = router;