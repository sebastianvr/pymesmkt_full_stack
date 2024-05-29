const { Router } = require('express');
const { query } = require('express-validator');
const multer = require('multer');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const validateFiles = require('../middlewares/files/validate-file');
const { uploadUserImage, getProfileUserImage, postReportFiles } = require('../controllers/minio.controller');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadUserImage',
    upload.single('image'),
    uploadUserImage
);

router.get('/profileImage', [
    validarJWT,
    query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
], getProfileUserImage);

router.post('/reportFiles', [
    validarJWT,
    validateFiles,
], postReportFiles);

module.exports = router;