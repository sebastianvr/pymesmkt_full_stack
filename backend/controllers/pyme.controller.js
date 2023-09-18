const { uid } = require('uid');
const { response, request } = require('express');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');


const pymesGet = async (req = request, res = response) => {
    try {
        const pymes = await Pyme.findAll({
            where: { estado: true },
        });
        res.status(200).json(pymes);
    } catch (error) {
        console.log(error);
    };
};

const pymeGet = async (req = request, res = response) => {
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
            res.status(200).json({
                ok: true,
                pyme,
            });
        }
        else res.status(400).json({
            ok: false,
            msg: 'No existe pyme con este id',
        });
    } catch (error) {
        console.log(error);
    }
};

const pymePost = async (req = request, res = response) => {

    const {
        nombrePyme,
        rut,
        emailPyme,
        rubro,
        rol,
        tipoEmpresa
    } = req.body;

    const myId = uid(15);

    nuevaPyyme = {
        id: myId,
        nombrePyme,
        rut,
        emailPyme,
        rubro,
        rol,
        tipoEmpresa,
    };

    try {
        await Pyme.create(nuevaPyyme);

        res.status(200).json({
            msg: 'nueva pyme creada',
        });
    } catch (error) {
        // console.log({error});
        res.status(400).json({
            msg: error,
        });
    };
};

const pymePut = (req = request, res = response) => {
    const { id } = req.params;

    // console.log({id});
    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id,
    });
};

const pymeDelete = async (req = request, res = response) => {
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

        console.log({ usuario });
        res.status(200).json({
            usuario,
        });

    } catch (error) {
        console.log({ error });
    };
};

module.exports = {
    pymesGet,
    pymeGet,
    pymePost,
    pymePut,
    pymeDelete
};