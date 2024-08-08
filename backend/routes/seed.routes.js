const { Router } = require('express');
const { createMockDataBase } = require('../controllers/seed/seed.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.post('/db',
    [
        validarJWT,
        check('nroUsuarios').optional().isInt({ min: 10, max: 150 }).withMessage('nroUsuarios debe ser un número entero entre 10 y 150.'),
        check('nroPublications').optional().isInt({ min: 0, max: 80 }).withMessage('nroPublications debe ser un número entero entre 0 y 80.'),
        check('nroOfertas').optional().isInt({ min: 0, max: 80 }).withMessage('nroOfertas debe ser un número entero entre 0 y 80.'),
        check('nroCompras').optional().isInt({ min: 0, max: 80 }).withMessage('nroCompras debe ser un número entero entre 0 y 80.'),
        check('nroReclamos').optional().isInt({ min: 0, max: 80 }).withMessage('nroReclamos debe ser un número entero entre 0 y 80.'),
        check('nroAdmins').optional().isInt({ min: 0, max: 20 }).withMessage('nroAdmins debe ser un número entero entre 0 y 20.'),
        validarCampos
    ],
    createMockDataBase
);

module.exports = router;