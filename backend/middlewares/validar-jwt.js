const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req, res = response, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({
            ok: false,
            msg: 'No se encuentra el token',
        });
    }

    // Separa el prefijo 'Bearer' del token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no proporcionado',
        });
    }

    const { rol } = jwt.decode(token);
    let secretKey;
    if (rol === 'ADMIN-USER') {
        secretKey = process.env.ADMIN_KEY;
    }

    if (rol === 'CLIENT-USER') {
        secretKey = process.env.CLIENT_KEY;
    }

    try {
        const { myId, nombreUsuario, rol } = jwt.verify(token, secretKey);
        req.id = myId;
        req.nombreUsuario = nombreUsuario;
        req.rol = rol;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                ok: false,
                msg: 'Token expirado',
            });
        }

        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido',
        });
    }

    next();
};

module.exports = { validarJWT };