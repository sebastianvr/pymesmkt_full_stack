const multer = require('multer');
const { request, response } = require('express');

// Configuración de Multer para el almacenamiento de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        files: 1, // Solo se permite un archivo
        fileSize: 5 * 1024 * 1024 // Máximo 5MB por archivo
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb({ code: 'FILE_TYPE_NOT_ALLOWED' });
        }
    }
}).single('image'); // Usar .single para un solo archivo

// Middleware para validar la carga de un solo archivo y que sea de tipo imagen
function validateImageFile(req = request, res = response, next) {
    upload(req, res, (err) => {
        console.error({err});
        if (err instanceof multer.MulterError) {
            // Multer ha lanzado un error
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'El tamaño del archivo es demasiado grande (máximo 5MB)' });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'Solo se permite un archivo' });
            }
            return res.status(500).json({ error: 'Error al subir el archivo', detail: err.message });
        } else if (err && err.code === 'FILE_TYPE_NOT_ALLOWED') {
            return res.status(400).json({ error: 'Tipo de archivo no permitido, solo se permiten imágenes' });
        } else if (err) {
            return res.status(500).json({ error: 'Error al procesar la solicitud', detail: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }

        next();
    });
}

module.exports = validateImageFile;
