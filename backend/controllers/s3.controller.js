const { request, response } = require('express');
const { s3Client } = require('../s3/connection');
const { uid } = require('uid');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const postUserImage = async (req = request, res = response) => {
    console.log('[s3] uploadUserImage()');

    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file = req.file;
        const fileName = `${uid()}.${file.originalname.split('.').pop()}`; // Genera un nombre único para el archivo

        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-images/${fileName}`, // Carpeta dentro del bucket
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        return res.status(200).json({
            ok: true,
            filePath: fileName
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
    }
};

const getUserImage = async (imageName) => {
    console.log('[s3] getProfileUserImage()');

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-images/${imageName}`
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL válida por 1 hora
        return url;

    } catch (error) {
        console.error(error);
        if (error.code === 'NoSuchKey') {
            return ({
                ok: false,
                msg: 'La imagen solicitada no existe',
                error
            });
        }

        return ({
            ok: false,
            msg: 'Error en el servidor, getProfileUserImage()',
            error
        });
    }
}

const getPublicationFile = async (zipName) => {
    console.log('[s3] getDataPublication()');

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-publications/${zipName}`
        };

        const command = new GetObjectCommand(params);

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL válida por 1 hora
        return url;

    } catch (error) {
        console.error(error);
        if (error.code === 'NoSuchKey') {
            return ({
                ok: false,
                msg: 'La información solicitada no existe',
                error
            });
        }

        return ({
            ok: false,
            msg: 'Error en el servidor, getDataPublication()',
            error
        });
    }
}

const postPublicationFile = async (req = request, res = response) => {
    console.log('[s3] postPublicationFile()');

    try {
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha proporcionado ningún archivo'
            });
        }

        const filepath = await postFileToS3(req.file, 'user-publications');
        return res.status(200).json({
            ok: true,
            filepath
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor postPublicationFile()',
            error
        });
    }
}

const getOfferFile = async (zipName) => {
    console.log('[s3] getDataOffer()');

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-offers/${zipName}`
        };

        const command = new GetObjectCommand(params);

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL válida por 1 hora
        return url;

    } catch (error) {
        console.error(error);
        if (error.code === 'NoSuchKey') {
            return ({
                ok: false,
                msg: 'La información solicitada no existe',
                error
            });
        }

        return ({
            ok: false,
            msg: 'Error en el servidor, getDataOffer()',
            error
        });
    }
}

const postOfferFile = async (req = request, res = response) => {
    console.log('[s3] postOfferFile()');
    try {
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha proporcionado ningún archivo'
            });
        }

        const filepath = await postFileToS3(req.file, 'user-offers');
        return res.status(200).json({
            ok: true,
            filepath
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor postOfferFile()',
            error
        });
    }
}

const postFileToS3 = async (file, nameFolder) => {
    const fileName = `${uid()}.${file.originalname.split('.').pop()}`;
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${nameFolder}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return fileName;
};

const postReportFile = async (req = request, res = response) => {
    console.log('[s3] postReportFile()');

    try {
        const filepath = await postFileToS3(req.file, 'user-reports');
        return res.status(200).json({
            ok: true,
            filepath
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor postReportFile()',
            error
        });
    }
}

const getReportFile = async (zipName) => {
    console.log('[s3] getReportFile()');

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-reports/${zipName}`
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL válida por 1 hora
        return url;

    } catch (error) {
        console.error(error);
        if (error.code === 'NoSuchKey') {
            return ({
                ok: false,
                msg: 'La información solicitada no existe',
                error
            });
        }

        return ({
            ok: false,
            msg: 'Error en el servidor, getReportFile()',
            error
        });
    }
}

module.exports = {
    postUserImage,
    getUserImage,
    postReportFile,
    postPublicationFile,
    getPublicationFile,
    getOfferFile,
    postOfferFile,
    getReportFile,
}