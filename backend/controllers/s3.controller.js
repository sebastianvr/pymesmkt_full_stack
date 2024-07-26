const { request, response } = require('express');
const { s3Client } = require('../s3/connection');
const { uid } = require('uid');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const uploadUserImage = async (req = request, res = response) => {
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

const getProfileUserImage = async (imageName) => {
    console.log('[s3] getProfileUserImage()');

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `user-images/${imageName}`
        };

        const command = new GetObjectCommand(params);

        // console.log({ command });
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

const postReportFiles = async (req = request, res = response) => {
    console.log('[minio] postReportFiles()');

    try {
        const filepaths = await postReportFilesToMinio(req.files);
        return res.status(200).json({
            ok: true,
            filepaths
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor postReportFiles()',
            error
        });
    }
}

const postReportFilesToMinio = async (files) => {
    console.log('[minio] postReportFilesToMinio()');
}

const postPublicationFiles = async (req = request, res = response) => {
    console.log('[s3] postPublicationFiles()');
    try {
        const filepaths = await postFilesToS3(req.files, 'user-publications');
        return res.status(200).json({
            ok: true,
            filepaths
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor postPublicationFiles()',
            error
        });
    }
}

const postFilesToS3 = async (files, nameFolder) => {
    const uploadPromises = files.map(async (file) => {
        const fileName = `${uid()}.${file.originalname.split('.').pop()}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${nameFolder}/${fileName}`, // Guardar en la carpeta nameFolder
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        return fileName;
    });

    return Promise.all(uploadPromises);
};

module.exports = {
    uploadUserImage,
    getProfileUserImage,
    postReportFiles,
    postPublicationFiles
}