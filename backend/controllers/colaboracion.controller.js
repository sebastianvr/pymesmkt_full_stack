const { uid } = require('uid');
const { response, request } = require('express');

const Colaboracion = require('../models/colaboracion');

const colaboracionesGet = async (req = request, res = response) => {

   

    try {
       
        const usuarios = await Colaboracion.findAll({});

        res.status(200).json({
            ok : true,
            usuarios
            
        });
    } catch (error) {
        console.log(error);
    }
}

const colaboracionPost = async (req = request, res = response) => {
    //Id unico de 15 caracteres, para cada nuevo usuario creado
    const myId = uid(15);

    const {
        pymeVenderora,
        pymeCompradora,
        cantidadDeCompras
    } = req.body

    const nuevaColaboracion = {
        id: myId,
        pymeVenderora,
        pymeCompradora,
        cantidadDeCompras
    }

    console.log(nuevaColaboracion)

    try {
        await Colaboracion.create(nuevaColaboracion);

        res.status(200).json({
            ok: true,
            msg: 'Nueva colaboracion creada'
        })
    } catch (error) {
        console.log(error)
    }

}

const colaboracionPut = (req = request, res = response) => {

    const { id } = req.params
    console.log(id)

    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id
    })
}

const colaboracionDelete = async (req = request, res = response) => {

    const { id } = req.params

    try {
        const usuario = await Usuario.update({ estado: 0 }, {
            where: {
                id: id
            },
        });

        // console.log(usuario)
        res.status(200).json({
            msg: 'Usuario eliminado de la bd'
        })



    } catch (error) {
        console.log(error)
    }
}

module.exports = {
   colaboracionesGet,
   colaboracionPost,
   colaboracionPut,
   colaboracionDelete
};