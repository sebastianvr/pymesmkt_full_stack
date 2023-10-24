const { minioClient } = require('../minio/connection');

const uploadUserImage = async (req = request, res = response) => {
    try {
        const file = req.file;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        const fileName = 'image-' + uniqueSuffix + '.' + extension;

        const data = await minioClient.putObfject('images-bucket', fileName, file.buffer);
        console.log({data});
        res.json({ filePath : fileName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
}

module.exports = {
    uploadUserImage,
}