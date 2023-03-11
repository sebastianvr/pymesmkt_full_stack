const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { colaboracionesGet,
    colaboracionPost,
    colaboracionPut,
    colaboracionDelete
} = require('../controllers/colaboracion.controller');

const { check, param } = require('express-validator');

const router = Router();

router.get('/', colaboracionesGet);

router.post('/', [
    check('pymeVenderora', 'El nombre de la pyme vendedora es obligatorio').not().isEmpty(),
    check('pymeCompradora', 'El nombre de la pyme compradora es obligatorio').not().isEmpty(),
    check('cantidadDeCompras', 'La catidad de compras es oblitoria').not().isEmpty(),
    validarCampos,
], colaboracionPost);

router.put('/:id', validarCampos, colaboracionPut);

router.delete('/:id', [
    param('id', 'El param id es obligatorio').not().isEmpty(),

    // validarJWT,
    validarCampos
], colaboracionDelete);

module.exports = router;