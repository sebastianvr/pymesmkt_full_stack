const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req, res = response, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No se encuentra el token',
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
        /* verificar parametros: token del ciente, clave de la firma, retorna el payload */
        const { myId, nombreUsuario, rol } = jwt.verify(token, secretKey);
        req.id = myId;
        req.nombreUsuario = nombreUsuario;
        req.rol = rol;

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // El token ha expirado, tomar una acción en consecuencia
            console.log('Token expirado:', error.expiredAt);
            res.status(401).json({
              ok: false,
              msg: 'Token expirado',
            });
            return;
        }
       
        console.log({error});    
        res.status(401).json({
            ok: false,
            msg: 'Token inválido',
        });
    }
    next();
};

module.exports = { validarJWT };