const { response, request } = require('express');
const { uid } = require('uid');

const Colaboracion = require('../models/colaboracion');


const colaboracionesGet = async (req = request, res = response) => {
    console.log('[colaboraciones] colaboracionesGet()');

    try {

        const usuarios = await Colaboracion.findAll();
        return res.status(200).json({
            ok: true,
            usuarios
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, colaboracionesGet()',
            error
        });
    }
}

const colaboracionPost = async (req = request, res = response) => {
    console.log('[colaboraciones] colaboracionPost()');

    const newId = uid(15);
    const {
        pymeVenderora,
        pymeCompradora,
        cantidadDeCompras
    } = req.body;

    const newCollaboration = {
        id: newId,
        pymeVenderora,
        pymeCompradora,
        cantidadDeCompras
    };

    // console.log(newCollaboration)
    try {
        await Colaboracion.create(newCollaboration);

        return res.status(200).json({
            ok: true,
            msg: 'Nueva colaboración creada'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, colaboracionPost()'
        });
    }

}

const colaboracionPut = (req = request, res = response) => {
    console.log('[colaboraciones] colaboracionPut()');

    try {
        const { id } = req.params;
        // console.log(id);

        return res.status(200).json({
            ok: true,
            msg: 'Put Api desde controlador',
            id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, colaboracionPut()',
            error
        });
    }
}

const colaboracionDelete = async (req = request, res = response) => {
    console.log('[colaboraciones] colaboracionDelete()');

    try {
        const { id } = req.params;
        const usuario = await Usuario.update(
            { estado: 0 },
            { where: { id } }
        );

        // console.log(usuario)
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado de la bd',
            usuario
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, colaboracionDelete()',
            error
        });
    }
}

module.exports = {
    colaboracionesGet,
    colaboracionPost,
    colaboracionPut,
    colaboracionDelete,
}