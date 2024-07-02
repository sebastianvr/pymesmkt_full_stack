const { Router } = require('express');
const { createMockDataBase } = require('../controllers/seed/seed.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.post('/db',
    [
        // validarJWT,
        check('nroUsuarios').optional().isInt({ min: 10, max: 200 }).withMessage('nroUsuarios debe ser un número entero de max 250'),
        check('nroPublications').optional().isInt({ min: 1, max: 100 }).withMessage('nroPublications debe ser un número entero de max 250'),
        check('nroOfertas').optional().isInt({ min: 0, max: 100 }).withMessage('nroOfertas debe ser un número entero de max 250'),
        check('nroCompras').optional().isInt({ min: 0, max: 100 }).withMessage('nroCompras debe ser un número entero de max 250'),
        check('nroReclamos').optional().isInt({ min: 0, max: 10 }).withMessage('nroAdmins debe ser un número entero de max 250'),
        check('nroAdmins').optional().isInt({ min: 0, max: 10 }).withMessage('nroAdmins debe ser un número entero de max 250'),
        validarCampos
    ],
    createMockDataBase
);

module.exports = router;