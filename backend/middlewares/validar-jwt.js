const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = async (req, res = response, next) => {
    //Obtengo el token en el header 
    // console.log('validarJWT() :' , req.header('token'))
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No se encuentra el token',
        });
    }
    try {
        /* verify parametros: token del ciente, clave de la firma, retorna el payload */
        const { myId, nombreUsuario } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.id = myId;
        req.nombreUsuario = nombreUsuario;


    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        })
    }

    next();

};


module.exports = {
    validarJWT
}