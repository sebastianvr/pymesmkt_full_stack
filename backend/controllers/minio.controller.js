const { minioClient } = require('../minio/connection');

const uploadUserImage = async (req = request, res = response) => {
    try {
        const file = req.file;
        const fileName = createFileName(file);

        const data = await minioClient.putObject('images-bucket', fileName, file.buffer);
        console.log({ data });
        res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
}

const createFileName = (file) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    const fileName = 'image-' + uniqueSuffix + '.' + extension;
    return fileName;
}

const getProfileUserImage = async (req = request, res = response) => {
    const imageName = req.query.image;
    console.log({ imageName });
    try {

        await minioClient.statObject('images-bucket', imageName);

        // Calcular la fecha de expiración (4 días desde ahora)
        // const expiration = new Date();
        // expiration.setSeconds(expiration.getSeconds() + 3 * 24 * 60 * 60); // Expira en 3 dias

        const url = await minioClient.presignedGetObject('images-bucket', imageName);


        res.status(200).send({ imageUrl: url });
    } catch (error) {
        // Si la imagen no existe, devolver un error
        if (error && error.code === 'NotFound') {
            res.status(404).send({ error: 'La imagen solicitada no existe' });
        } else {
            console.error('Error al obtener la imagen del perfil del usuario:', error);
            res.status(500).send({ error: 'Error al obtener la imagen del perfil del usuario' });
        }
    }
}

module.exports = {
    uploadUserImage,
    getProfileUserImage,
}