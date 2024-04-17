const { Router } = require('express');
const multer = require('multer');
const { validarCampos } = require('../middlewares/validar-campos');

const { check, param, body, query } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { uploadUserImage, getProfileUserImage, postReportFiles } = require('../controllers/minio.controller');
const validateFiles = require('../middlewares/files/validate-file');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadUserImage',
    upload.single('image'),
    uploadUserImage
);

router.get('/profileImage', [
    query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
], getProfileUserImage);

router.post('/reportFiles', [
    validateFiles,
], postReportFiles);


module.exports = router;