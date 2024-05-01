const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { uid } = require('uid');

const { createJWT } = require('../helpers/create-jwt');
const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');

const signInPost = async (req = request, res = response) => {
    console.log('[sign-in] signInPost()');

    const {
        // Atributos para la tabla Usuarios
        nombreUsuario,
        apellidos,
        run,
        emailUsuario,
        imagen,
        contrasenia,
        comuna,
        region,
        dir1Propietario,
        dir2Propietario,
        descripcion,
        rol,

        // Atributos para tabla Pymes
        nombrePyme,
        rut,
        rubro,
        tipoEmpresa,
        regionEmpresa,
        comunaEmpresa,
        dirEmpresa,
        descripcionEmpresa,
    } = req.body;

    //Encryptar contraseña
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(contrasenia, salt);

    //Generar JWT
    const newId = uid(15);
    const token = await createJWT(newId, nombreUsuario, 'CLIENT-USER');

    const newUser = {
        id: newId,
        nombreUsuario,
        apellidos,
        emailUsuario,
        imagen,
        run,
        contrasenia: password,
        comuna,
        region,
        dir1Propietario,
        dir2Propietario,
        descripcion,
        rol,
        Pyme: {
            id: uid(15),
            nombrePyme,
            rut,
            rubro,
            tipoEmpresa,
            regionEmpresa,
            comunaEmpresa,
            dirEmpresa,
            descripcionEmpresa,
            UsuarioId: newId
        }
    };

    // console.log(newUser);
    try {
        await Usuario.create(newUser,
            { include: [Pyme] }
        );

        return res.status(201).json({
            ok: true,
            myId: newId,
            nombreUsuario,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, signInPost().',
            error
        });
    }
}

const existeCorreo = async (req = request, res = response) => {
    console.log('[sign-in] existeCorreo()');

    const { correo } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { emailUsuario: correo } });
        if (usuario) {
            return res.status(200).json({
                state: true,
                msg: 'Este correo ya está registrado en la bd',
            });
        } else {
            return res.status(200).json({
                state: false,
                msg: 'Este correo esta disponible para registrar',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, existeCorreo().',
            error
        });
    }
}

const existeRun = async (req = request, res = response) => {
    console.log('[sign-in] existeRun()');

    const { run } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { run } });

        if (usuario) {
            return res.status(200).json({
                state: true,
                msg: 'Este run ya está registrado en la bd',
            });
        } else {
            return res.status(200).json({
                state: false,
                msg: 'Este run esta disponible para registrar',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, existeRun().',
            error
        });
    }
}

const existeRut = async (req = request, res = response) => {
    console.log('[sign-in] existeRut()');

    const { rut } = req.params;
    try {
        
        const usuario = await Pyme.findOne({ where: { rut } });
        if (usuario) {
            return res.status(200).json({
                state: true,
                msg: 'Este rut ya está registrado en la bd',
            });
        } else {
            return res.status(200).json({
                state: false,
                msg: 'Este rut esta disponible para registrar',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, existeRut().',
            error
        });
    }
}

module.exports = {
    signInPost,
    existeCorreo,
    existeRun,
    existeRut,
};