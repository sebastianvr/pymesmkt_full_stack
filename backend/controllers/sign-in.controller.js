const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { uid } = require('uid');
const { createJWT } = require('../helpers/create-jwt');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');

const signInPost = async (req = request, res = response) => {
    //Id unico de 15 caracteres, para cada nuevo usuario creado
    const myId = uid(15);

    // Obtengo la informacion del body
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
    } = req.body


    //encryptar contraseña
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(contrasenia, salt);

    // generar JWT
    console.log('before createJWT')
    const token = await createJWT(myId, nombreUsuario, 'CLIENT-USER');

    const nuevoUsuario = {
        id: myId,
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
            UsuarioId: myId
        }
    }

    // console.log(nuevoUsuario)
    try {
        await Usuario.create(nuevoUsuario, {
            include: [Pyme]
        });

        return res.status(201).json({
            ok: true,
            myId,
            nombreUsuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const existeCorreo = async (req = request, res = response) => {
    const { correo } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { emailUsuario: correo } });
        if (usuario) {
            res.status(200).json({
                state: true,
                msg: 'Este correo ya está registrado en la bd',
            });
        } else {
            res.status(200).json({
                state: false,
                msg: 'Este correo esta disponible para registrar',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

const existeRun = async (req = request, res = response) => {
    const { run } = req.params;
    try {
        const usuario = await Usuario.findOne({ where: { run } });
        if (usuario) {
            res.status(200).json({
                state: true,
                msg: 'Este run ya está registrado en la bd',
            })
        } else {
            res.status(200).json({
                state: false,
                msg: 'Este run esta disponible para registrar',
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const existeRut = async (req = request, res = response) => {
    const { rut } = req.params;
    try {
        const usuario = await Pyme.findOne({ where: { rut } });
        if (usuario) {
            res.status(200).json({
                state: true,
                msg: 'Este rut ya está registrado en la bd',
            });
        } else {
            res.status(200).json({
                state: false,
                msg: 'Este rut esta disponible para registrar',
            });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    signInPost,
    existeCorreo,
    existeRun,
    existeRut,
};