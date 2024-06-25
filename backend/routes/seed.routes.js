const { Router } = require('express');
const { createMockDataBase } = require('../controllers/seed/seed.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/usuario', 
// validarJWT,
createMockDataBase);

module.exports = router;