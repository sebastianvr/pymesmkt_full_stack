const bcryptjs = require('bcryptjs');
const { response, request } = require("express");

const { createJWT } = require('../helpers/create-jwt');
const Usuario = require("../models/usuario");


const login = async (req = request, res = response) => {
    const { emailUsuario, contrasenia } = req.body
    try {
        //verificar si email existe en BD
        const usuario = await Usuario.findOne({ where: { emailUsuario } });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msj: "No existe este correo."
            });
        }

        //verificar si el usuario esta activo en BD
        if (!usuario.estado) {
            return res.status(400).json({
                ok: false,
                msj: "Este usuario está eliminado."
            });
        }

        //validar contraseña con la BD
        const validaPass = bcryptjs.compareSync(contrasenia, usuario.contrasenia);
        if (!validaPass) {
            return res.status(400).json({
                ok: false,
                msj: "Contraseña incorrecta."
            });
        }

        //gererar JWT
        /* En el payload solo guardo mi id de usuario */
        const token = await createJWT(usuario.id, usuario.nombreUsuario);
        res.status(200).json({
            ok: true,
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error,
            msj: "Error hable con el administrador."
        })
    }
}

const revalidarToken = async (req = request, res = response) => {

    const { id, nombreUsuario } = req;
    // console.log('revalidarToken() -> req :',req)

    // console.log(id , nombreUsuario)
    try {
        const token = await createJWT(id, nombreUsuario)
        
        
        return res.status(200).json({
            ok: true,
            id,
            nombreUsuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            error,
            msg: 'error en revalidarToken()'
        })
    }
    
}

module.exports = {
    login, 
    revalidarToken
}