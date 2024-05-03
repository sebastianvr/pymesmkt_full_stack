const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});

createBucket('images-bucket');
createBucket('files-bucket');

async function createBucket(bucketName) {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
        }
        console.log(`Bucket name ${bucketName} ha sido creado.`);
        
    } catch (error) {
        console.error(error);
    }
}

module.exports = { minioClient };