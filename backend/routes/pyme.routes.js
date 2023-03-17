const { Router } = require('express');
const { param } = require('express-validator');
const { pymesGet,
    pymeGet,
    pymePost,
    pymePut,
    pymeDelete } = require('../controllers/pyme.controller');
const { existeRut } = require('../controllers/sign-in.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', pymesGet);

router.get('/:UsuarioId', [
    param('UsuarioId', 'El id es obligatorio').not().isEmpty(),
    validarCampos
], pymeGet);

router.post('/', pymePost);

router.put('/:id', pymePut);

router.delete('/:id', pymeDelete);

router.get('/rut/:rut', [
    param('rut', 'El rut es obligatorio').not().isEmpty(),
    validarCampos
], existeRut)

module.exports = router;