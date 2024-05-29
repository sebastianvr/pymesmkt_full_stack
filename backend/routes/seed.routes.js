const { Router } = require('express');
const { createUsersSeed } = require('../controllers/seed.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/usuario', validarJWT, createUsersSeed);

module.exports = router;