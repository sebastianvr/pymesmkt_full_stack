const { request } = require('express');
const multer = require('multer');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        files: 8, // Máximo de archivos permitidos
        fileSize: 15 * 1024 * 1024 // Máximo 15MB en total
    },
    fileFilter: (req, file, cb) => {
        try {
            // Permitir solo imágenes, PDFs y archivos ZIP
            if (file.mimetype.startsWith('image/') ||
                file.mimetype === 'application/pdf' ||
                file.mimetype === 'application/zip'
            ) {
                cb(null, true);
            } else {
                cb({ code: 'FILE_TYPE_NOT_ALLOWED' });
            }
        } catch (error) {
            cb(error);
        }
    }
}).array('files');

// Middleware para validar la carga de archivos
function validateFiles(req = request, res, next) {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer ha lanzado un error
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'El tamaño del archivo es demasiado grande (máximo 15MB)' });
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'No se han proporcionado archivos' });
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ error: 'Se han proporcionado demasiados archivos' });
            } else if (err.code === 'LIMIT_PART_COUNT') {
                return res.status(400).json({ error: 'Demasiadas partes en el formulario' });
            } else if (err.code === 'LIMIT_FIELD_KEY') {
                return res.status(400).json({ error: 'El nombre del campo es demasiado largo' });
            } else if (err.code === 'LIMIT_FIELD_VALUE') {
                return res.status(400).json({ error: 'El valor del campo es demasiado largo' });
            } else if (err.code === 'LIMIT_FIELD_COUNT') {
                return res.status(400).json({ error: 'Demasiados campos en el formulario' });
            } else if (err.code === 'MISSING_FIELD_NAME') {
                return res.status(400).json({ error: 'Falta el nombre del campo' });
            }
            return res.status(500).json({ error: 'Error al subir los archivos' });
        } else if (err && err.code === 'FILE_TYPE_NOT_ALLOWED') {
            // El error customizado FILE_TYPE_NOT_ALLOWED 
            return res.status(400).json({ error: 'Tipo de archivo no permitido' });
        } else if (err) {
            // Otro tipo de error
            return res.status(500).json({ error: 'Error al procesar la solicitud' });
        }

        // Verificar si se proporcionaron archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han proporcionado archivos' });
        }

        next();
    });
}


module.exports = validateFiles;
