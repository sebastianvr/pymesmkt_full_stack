const { Router } = require('express');
const { check, param } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { colaboracionesGet,
    colaboracionPost,
    colaboracionPut,
    colaboracionDelete
} = require('../controllers/colaboracion.controller');

const router = Router();

router.get('/', colaboracionesGet);

router.post('/', [
    validarJWT,
    check('pymeVenderora', 'El nombre de la pyme vendedora es obligatorio').not().isEmpty(),
    check('pymeCompradora', 'El nombre de la pyme compradora es obligatorio').not().isEmpty(),
    check('cantidadDeCompras', 'La catidad de compras es oblitoria').not().isEmpty(),
    validarCampos,
], colaboracionPost);

router.put('/:id', validarJWT, colaboracionPut);

router.delete('/:id', [
    validarJWT,
    param('id', 'El param id es obligatorio').not().isEmpty(),
    validarCampos
], colaboracionDelete);

module.exports = router;