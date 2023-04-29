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
        /* En el payload guardo id - nombre - rol */
        const token = await createJWT(usuario.id, usuario.nombreUsuario, usuario.rol);
        res.status(200).json({
            ok: true,
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol,
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            error,
            msj: "Error hable con el administrador."
        })
    }
}

const revalidarToken = async (req = request, res = response) => {

    const { id, nombreUsuario, rol } = req;
    try {
        const token = await createJWT(id, nombreUsuario, rol)
        return res.status(200).json({
            ok: true,
            id,
            nombreUsuario,
            rol,
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