const { Router } = require('express');
const multer = require('multer');
const { validarCampos } = require('../middlewares/validar-campos');

const { check, param, body } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { uploadUserImage } = require('../controllers/minio.controller');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }); 
router.post('/uploadUserImage', upload.single('image'), uploadUserImage);

module.exports = router;