const { response, request } = require('express');
const { uid } = require('uid');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');


const pymesGet = async (req = request, res = response) => {
    console.log('[pymes] pymesGet()');

    try {
        const pymes = await Pyme.findAll(
            { where: { estado: true } }
        );

        return res.status(200).json({
            ok: true,
            pymes,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, pymesGet()',
            error
        });
    };
};

const pymeGet = async (req = request, res = response) => {
    console.log('[pymes] pymeGet()');

    const { UsuarioId } = req.params;
    // console.log({UsuarioId});
    try {
        const pyme = await Pyme.findOne({
            where: {
                UsuarioId,
                estado: 1,
            },
        });

        // console.log({pyme});
        if (pyme) {
            return res.status(200).json({
                ok: true,
                pyme,
            });
        }
        else {
            return res.status(400).json({
                ok: false,
                msg: 'No existe pyme con este id',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, pymeGet()',
            error
        });
    }
};

const pymePost = async (req = request, res = response) => {
    console.log('[pymes] pymePost()');

    const {
        nombrePyme,
        rut,
        emailPyme,
        rubro,
        rol,
        tipoEmpresa
    } = req.body;

    const newId = uid(15);

    newSme = {
        id: newId,
        nombrePyme,
        rut,
        emailPyme,
        rubro,
        rol,
        tipoEmpresa,
    };

    try {
        await Pyme.create(newSme);

        return res.status(200).json({
            ok: true,
            msg: 'Nueva pyme creada.',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, pymePost().',
            error,
        });
    };
};

const pymePut = (req = request, res = response) => {
    console.log('[pymes] pymePost()');

    const { id } = req.params;
    try {
        // console.log({id});
        return res.status(200).json({
            ok: true,
            msg: 'Put Api desde controlador',
            id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, pymePut()',
            error
        });
    }
};

const pymeDelete = async (req = request, res = response) => {
    console.log('[pymes] pymeDelete()');

    const { id } = req.params;
    try {
        const usuario = await Usuario.update(
            { estadoUsuario: 0 },
            {
                where: {
                    estadoUsuario: 1,
                    idUsuario: id,
                },
            });

        // console.log({ usuario });
        return res.status(200).json({
            ok: true,
            usuario,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, pymeDelete()',
            error
        });
    };
};

module.exports = {
    pymesGet,
    pymeGet,
    pymePost,
    pymePut,
    pymeDelete,
};