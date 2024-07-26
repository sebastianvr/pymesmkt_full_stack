const { Router } = require('express');
const { query } = require('express-validator');
const multer = require('multer');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const validateFiles = require('../middlewares/files/validate-file');
const { uploadUserImage, getProfileUserImage, postReportFiles, postPublicationFiles } = require('../controllers/s3.controller');
const validateImageFile = require('../middlewares/files/validate-image');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadUserImage', [
    upload.single('image'),
    // validateImageFile,
],
    uploadUserImage
);

router.get('/profileImage', [
    validarJWT,
    query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
    validateImageFile
], getProfileUserImage);

router.post('/reportFiles', [
    validarJWT,
    validateFiles,
], postReportFiles);

router.post('/publication', [
    validarJWT,
    validateFiles
], postPublicationFiles);

module.exports = router;