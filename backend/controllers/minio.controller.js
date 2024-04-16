const { request } = require('express');
const { minioClient } = require('../minio/connection');

const uploadUserImage = async (req = request, res = response) => {
    try {
        const file = req.file;
        const fileName = createFileName(file, 'image');

        const data = await minioClient.putObject('images-bucket', fileName, file.buffer);
        // console.log({ data });
        res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
}

const createFileName = (file, prefix) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    const fileName = prefix + '-' + uniqueSuffix + '.' + extension;
    return fileName;
}

const getProfileUserImage = async (req = request, res = response) => {
    const imageName = req.query.image;
    // console.log({ imageName });
    try {
        await minioClient.statObject('images-bucket', imageName);
        // Calcular la fecha de expiración (4 días desde ahora)
        // const expiration = new Date();
        // expiration.setSeconds(expiration.getSeconds() + 3 * 24 * 60 * 60); // Expira en 3 dias

        const url = await minioClient.presignedGetObject('images-bucket', imageName);
        res.status(200).json({ imageUrl: url });
    } catch (error) {
        // Si la imagen no existe, devolver un error
        if (error && error.code === 'NotFound') {
            res.status(404).json({
                error: 'La imagen solicitada no existe'
            });
        } else {
            console.error('Error al obtener la imagen del perfil del usuario:', error);
            res.status(500).json({
                error: 'Error al obtener la imagen del perfil del usuario'
            });
        }
    }
}

const postReportFiles = async (req = request, res) => {
    try {
        const filepaths = await postReportFilesToMinio(req.files);
        return res.status(200).json({ filepaths });

    } catch (error) {
        console.error('Error al manejar la subida de archivos:', error);
        return res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
}

const postReportFilesToMinio = async (files) => {
    const fileNames = [];

    const uploadPromises = files.map(async (file) => {
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-UserID': '123456',
        };

        const fileStream = Buffer.from(file.buffer);
        const fileName = createFileName(file, 'file')
        await minioClient.putObject('files-bucket', fileName, fileStream, file.size, metaData);

        fileNames.push(fileName);
    });

    // Ejecutar todas las promesas de subida de archivos en paralelo
    await Promise.all(uploadPromises);
    return fileNames;
}

module.exports = {
    uploadUserImage,
    getProfileUserImage,
    postReportFiles,
}