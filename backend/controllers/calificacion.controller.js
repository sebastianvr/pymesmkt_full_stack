const { uid } = require('uid');
const { response, request } = require('express');

const Calificacion = require('../models/calificacion');
const Compra = require('../models/compra');


const calificacionPost = async (req = request, res = response) => {
    //Id unico de 15 caracteres, para cada nueva publicacion creada
    const myId = uid(15);

    const {
        reseña,
        puntaje,
        // id del usuario que RECIBIRÁ la calificacion
        UsuarioId,
        // id de la compra que esta calificando
        CompraId
    } = req.body


    const nuevaCalificacion = {
        id: myId,
        reseña,
        puntaje,
        UsuarioId,
        CompraId
    }

    // console.log(nuevaCalificacion)

    try { 
        // primero creo la nueva calificacion
        const { id } = await Calificacion.create(nuevaCalificacion);


        // actualizo tabla compra con el id de calificacion
        const compra = await Compra.update({ CalificacionId: id }, {
            where: { id: nuevaCalificacion.CompraId }
        });

        // console.log('compra', compra)
        return res.status(200).json({
            ok: true,
            id,
            msg: 'Nueva calificación creada'
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            error,
            msg: 'Error al crear calificación.'
        })
    }

}


module.exports = {
    calificacionPost
};