const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

async function createBucket(bucketName) {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
        }
        console.log('Bucket creado exitosamente');
    } catch (error) {
        console.error(error);
    }
}

createBucket('files-bucket');

module.exports = { minioClient };