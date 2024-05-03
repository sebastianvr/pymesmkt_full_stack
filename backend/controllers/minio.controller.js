const { request } = require('express');
const { minioClient } = require('../minio/connection');

const uploadUserImage = async (req = request, res = response) => {
    console.log('[minio] uploadUserImage()');

    try {
        const file = req.file;
        const fileName = createFileName(file, 'image');

        const data = await minioClient.putObject('images-bucket', fileName, file.buffer);
        // console.log({ data });
        return res.status(200).json({
            ok: true,
            filePath: fileName
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: 'Error en el servidor, uploadUserImage().',
            error
        });
    }
}

const createFileName = (file, prefix) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    const fileName = prefix + '-' + uniqueSuffix + '.' + extension;
    return fileName;
}

const getProfileUserImage = async (req = request, res = response) => {
    console.log('[minio] getProfileUserImage()');

    const imageName = req.query.image;
    // console.log({ imageName });

    try {
        await minioClient.statObject('images-bucket', imageName);
        // Calcular la fecha de expiración (4 días desde ahora)
        // const expiration = new Date();
        // expiration.setSeconds(expiration.getSeconds() + 3 * 24 * 60 * 60); // Expira en 3 dias

        const url = await minioClient.presignedGetObject('images-bucket', imageName);
        return res.status(200).json({
            ok: true,
            imageUrl: url
        });

    } catch (error) {
        // Si la imagen no existe, devolver un error
        if (error && error.code === 'NotFound') {
            return res.status(404).json({
                ok: false,
                error: 'La imagen solicitada no existe'
            });
        } else {
            console.error('Error al obtener la imagen del perfil del usuario:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error al obtener la imagen del perfil del usuario'
            });
        }
    }
}

const postReportFiles = async (req = request, res) => {
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

    const fileNames = [];
    const uploadPromises = files.map(async (file) => {
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-UserID': '123456',
        };

        const fileStream = Buffer.from(file.buffer);
        const fileName = createFileName(file, 'file');
        await minioClient.putObject('files-bucket', fileName, fileStream, file.size, metaData);
        fileNames.push(fileName);
    });

    await Promise.all(uploadPromises);
    return fileNames;
}

module.exports = {
    uploadUserImage,
    getProfileUserImage,
    postReportFiles,
}