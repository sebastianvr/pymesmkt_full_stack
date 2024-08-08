const { Router } = require('express');
const { query } = require('express-validator');
const multer = require('multer');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const validateFiles = require('../middlewares/files/validate-file');
const {
    postUserImage,
    getUserImage,
    getPublicationFile,
    postPublicationFile,
    postOfferFile,
    getOfferFile,
    postReportFile
} = require('../controllers/s3.controller');
const validateImageFile = require('../middlewares/files/validate-image');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadUserImage', [
    validarJWT,
    upload.single('image'),
    // validateImageFile,
], postUserImage
);

router.get('/profileImage', [
    validarJWT,
    query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
    validateImageFile
], getUserImage);

router.get('/publication', [
    validarJWT,
    // query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
    // validateImageFile
], getPublicationFile);

router.post('/publication', [
    validarJWT,
    // validateFiles
    upload.single('file')
], postPublicationFile);

router.get('/offer', [
    validarJWT,
    // query('image').notEmpty().withMessage('El parámetro image es obligatorio'),
    validarCampos,
    // validateImageFile
], getOfferFile);

router.post('/offer', [
    validarJWT,
    // validateFiles
    upload.single('file')
], postOfferFile);

router.post('/report-file', [
    validarJWT,
    // validateFiles,
    upload.single('file')
], postReportFile);

module.exports = router;