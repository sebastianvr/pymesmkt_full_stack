const { response, request } = require('express');
const { uid } = require('uid');

const Calificacion = require('../models/calificacion');
const Compra = require('../models/compra');


const calificacionPost = async (req = request, res = response) => {
    console.log('[calificaciones] calificacionPost()');

    const {
        reseña,
        puntaje,
        UsuarioId, // id del usuario que RECIBIRÁ la calificacion
        CompraId // id de la compra que esta calificando
    } = req.body;

    const newId = uid(15);
    const newCalification = {
        id: newId,
        reseña,
        puntaje,
        UsuarioId,
        CompraId
    };

    // console.log(nuevaCalificacion)
    try {
        // primero creo la nueva calificacion
        const { id } = await Calificacion.create(newCalification);

        // actualizo tabla compra con el id de calificacion
        const compra = await Compra.update(
            { CalificacionId: id },
            { where: { id: newCalification.CompraId } }
        );

        // console.log('compra', compra)
        return res.status(200).json({
            ok: true,
            msg: 'Nueva calificación creada',
            id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, calificacionPost().',
            error
        })
    }

}

module.exports = {
    calificacionPost,
};