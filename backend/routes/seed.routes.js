const { Router } = require('express');
const { crearUsuario } = require('../controllers/seed.controller');

const router = Router();

router.post('/usuario', [], crearUsuario);

module.exports = router;