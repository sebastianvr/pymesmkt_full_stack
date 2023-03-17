const { uid } = require('uid');
const { response, request } = require('express');

const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');
const Usuario = require('../models/usuario');
const Calificacion = require('../models/calificacion');



// Obtiene todas las publicaciones de TODOS los usuarios 
const publicacionesGetAll = async (req = request, res = response) => {

    const { page, size } = req.query;

    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }

        let size = 10
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 100) {
            size = sizeAsNumber;
        }

        let publicaciones = await Publicacion.findAndCountAll({
            where: {
                estado: true,
                procesoDePublicacion: 'INICIADA'
            },
            limit: size,
            offset: page * size,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Usuario,
                    // raw : true
                    where: { estado: true },
                    attributes: ['nombreUsuario', 'id', 'apellidos'],
                    // group : ['id'],
                    include: [
                        {
                            model: Calificacion,
                            // where: { estado: true },
                            // attributes: ['id' , [db.fn('AVG', db.col('puntaje')), 'promedio']],
                            // include : [[db.fn("COUNT", db.col("puntaje")), "no_hats"]]
                            // attributes: ['id', [db.fn('AVG', db.col('puntaje')), 'promedio']],
                            // attributes: ['puntaje'],
                            // group: ['id'],

                        // agrupar por id del usuario, y hacer el avg del puntaje
                        },
                        {
                            model: Pyme,
                            where: { estado: true },
                            attributes: ['nombrePyme'],
                            group: ['nombrePyme']

                        },

                    ],

                },
            ],
        });


        console.log('Publicaciones: ', publicaciones)
        // aqui calcular el promedo de calificacion para cada publicacion

        // let calificacion = await Calificacion.findAll({
        //     attributes: [[db.fn('AVG', db.col('puntaje')), 'promedio']],
        //     where: { UsuarioId: '281bf2c88ebe135' }
        // })
        // console.log('Promedio del Puntaje :', calificacion[0].dataValues.promedio)
        // // console.log('wewewewewewe', publicacion.rows)
        // console.log(publicacion)

        res.status(200).json({
            totalPages: Math.ceil(publicaciones.count / size),
            content: publicaciones.rows,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msj: 'Ocurrio un error en publicacionesGetAll()',
            error
        });
    }
}

// Obtiene una sola publicacion segun un id
const publicacionGet = async (req = request, res = response) => {

    const { id } = req.params;
    try {
        const publicacion = await Publicacion.findByPk(id, {
            where: {
                estado: true,
                // procesoDePublicacion: 'INICIADA'
            },
            include: [
                {
                    model: Usuario,
                    where: { estado: true },
                    attributes: ['id'],
                    include: [
                        {
                            model: Pyme,
                            where: { estado: true },
                            attributes: ['nombrePyme'],
                        },
                        {
                            model: Calificacion,
                            // where: { estado: true },
                            // attributes: ['puntaje', [db.fn('AVG', db.col('puntaje')), 'promedio']],
                            // group: ['Pyme.id', 'Usuario.id', 'Publicacion.id'],
                            attributes: ['puntaje']
                        },

                    ],
                }
            ],
            // group : ['id']

        })

        if (!publicacion.estado) {
            res.status(400).json({
                ok: false,
                msg: `Esta publicación fue eliminada, ${id}`
            })
        } else if (!publicacion.UsuarioId) {
            res.status(400).json({
                ok: false,
                msg: `No existe publicación con id: ${id}`
            })
        } else {

            // calcular promedio total
            const calificaciones = publicacion.Usuario.Calificacions
            let sumatoria = 0

            for (let i = 0; i < calificaciones.length; i++) {
                sumatoria = sumatoria + parseInt(publicacion.Usuario.Calificacions[i].puntaje)
            }

            publicacion.dataValues.numEstrellas = sumatoria / calificaciones.length


            res.status(200).json({
                ok: true,
                publicacion
            });
        }


    } catch (error) {
        console.log(error)
    }
}

// Obtiene todas las publicaciones de UN usuario especifico
const publicacionesGet = async (req = request, res = response) => {

    const { idUsuario } = req.params;
    const { page, size } = req.query;

    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }

        let size = 10
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber;
        }

        const publicacion = await Publicacion.findAndCountAll({
            limit: size,
            offset: page * size,
            where: {
                estado: true,
                UsuarioId: idUsuario,
                procesoDePublicacion: 'INICIADA',

            },
            order: [['createdAt', 'DESC']],
        });


        console.log('publicacion :', publicacion)
        if (publicacion.count === 0) {
            res.status(200).json({
                ok: true,
                publicacion,
                msg: 'No existen publicaciones de este usuario'
            })
        }

        if (publicacion.count > 0) {
            res.status(200).json({
                ok: true,
                totalPages: Math.ceil(publicacion.count / size),
                content: publicacion.rows,
            });
        }



    } catch (error) {
        res.status(400).json({
            ok: false,
            error,
            msg: 'Error al crear publicación.'
        })
    }
}

const publicacionPost = async (req = request, res = response) => {
    //Id unico de 15 caracteres, para cada nueva publicacion creada
    const myId = uid(15);

    const {
        titulo,
        descripcion,
        productoOServicio,
        cantidadElementos,
        precioUnidad,
        precioTotal,
        modelo,
        color,
        fechaInicioServicio,
        fechaFinServicio,
        horasATrabajar,
        garantia,
        aniosGarantia,
        archivoAdjunto,

        // id del usuario que referenciará a la publicacion
        UsuarioId
    } = req.body


    const nuevaPublicacion = {
        id: myId,
        titulo,
        descripcion,
        productoOServicio,
        cantidadElementos,
        precioUnidad,
        precioTotal,
        modelo,
        color,
        fechaInicioServicio,
        fechaFinServicio,
        horasATrabajar,
        garantia,
        aniosGarantia,
        archivoAdjunto,

        // id del usuario que referenciará a la publicacion
        UsuarioId

    }

    console.log(nuevaPublicacion)

    try {
        const { id } = await Publicacion.create(nuevaPublicacion, {
            // include: [Pyme]
        });
        res.status(200).json({
            ok: true,
            id,
            msg: 'Nueva publicación creada'
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            error,
            msg: 'Error al crear publicación.'
        })
    }

}

const publicacionPut = (req = request, res = response) => {

    const { id } = req.params
    console.log(id)

    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id
    })
}

// actualiza el estado de compra de una publicacion a traves de su id
const publicacionPagada = async (req = request, res = response) => {

    const { id } = req.params

    try {
        const publicacion = await Publicacion.update({ procesoDePublicacion: 'FINALIZADA' }, {
            where: { id },
        });

        if (publicacion[0] === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe publicación con este id',
                id
            })
        } else {
            return res.status(200).json({
                ok: true,
                msg: 'Publicación fue modificada correctamente',
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'error en publicacionPagada()',
            error
        })
    }
}

const publicacionDelete = async (req = request, res = response) => {

    const { id } = req.params

    try {
        const publicacion = await Publicacion.update({ estado: 0 }, {
            where: {
                id: id
            },
        });

        res.status(200).json({
            msg: 'Publicación eliminada de la bd'
        })

    } catch (error) {
        console.log(error)
    }
}

// retorna todas las publicaciones compradas por un idUsuario
const publicacionesCompradas = async (req = request, res = response) => {

    const { idUsuario } = req.params;
    const { page, size } = req.query;

    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }

        let size = 10
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber;
        }

        const publicacion = await Publicacion.findAndCountAll({
            limit: size,
            offset: page * size,
            where: {
                estado: true,
                UsuarioId: idUsuario,
                procesoDePublicacion: 'FINALIZADA'
            },
            order: [['createdAt', 'DESC']],
        });


        if (publicacion.count === 0) {
            res.status(200).json({
                ok: true,
                publicacion,
                msg: 'No existen publicaciones compradas de este usuario'
            })
        }

        if (publicacion.count > 0) {
            res.status(200).json({
                ok: true,
                totalPages: Math.ceil(publicacion.count / size),
                content: publicacion.rows,
            });
        }



    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            error,
            msg: 'Error al buscar publicaciónes compradas.'
        })
    }
}

module.exports = {
    publicacionesGetAll,
    publicacionGet,
    publicacionesGet,
    publicacionPost,
    publicacionPut,
    publicacionDelete,
    publicacionPagada,
    publicacionesCompradas
};