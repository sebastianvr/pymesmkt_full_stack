const { validationResult } = require('express-validator');
const { response, request } = require('express');
const { uid } = require('uid');

const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');
const Usuario = require('../models/usuario');
const Calificacion = require('../models/calificacion');
const { Sequelize, Op } = require('sequelize');

/**
 * Obtiene todas las publicaciones de TODOS los usuarios.
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
const publicacionesGetAll = async (req = request, res = response) => {
    console.log('publicacionesGetAll()');

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
                    where: { estado: true },
                    attributes: ['nombreUsuario', 'id', 'apellidos'],
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

        console.log({ publicaciones });
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

/**
 * Obtiene una sola publicación segun un id.
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
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

/**
 * Obtiene todas las publicaciones de UN usuario específico.
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
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

/**
 * Actualiza el estado de compra de una publicación a través de su id
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
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

/**
 * Retorna todas las publicaciones compradas por un idUsuario.
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
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

const publicacionesFilterQuery = async (req = request, res = response) => {

    const page = parseInt(req.query.page) || 1; // Página actual (predeterminada: 1)
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de página (predeterminado: 10)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    try {
        const filter = {
            estado: true,
            procesoDePublicacion: "INICIADA",
        };

        if (req.query.titulo) {
            filter.titulo = {
                [Sequelize.Op.and]: [
                    Sequelize.fn('LOWER', Sequelize.col('titulo')),
                    {
                        [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
                    },
                ],
            };
        };

        if (req.query.id) {
            filter.id = req.query.id;
        };

        if (req.query.cantidadOfertasRecibidas) {
            filter.cantidadOfertasRecibidas = {
                [Sequelize.Op.lte]: parseInt(req.query.cantidadOfertasRecibidas),
            };
        };

        if (req.query.precioTotal) {
            filter.precioTotal = {
                [Sequelize.Op.lte]: parseInt(req.query.precioTotal),
            };
        };

        if (req.query.garantia) {
            filter.garantia = (req.query.garantia === "true");
        };

        if (req.query.productoOServicio) {
            filter.productoOServicio = req.query.productoOServicio;
        };

        console.log({ filter });
        const { count, rows: publicaciones } =
            await Publicacion.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

        if (!publicaciones.length) {
            return res.status(400).json({
                message: 'No se encontraron coincidencias.',
                publicaciones: null,
            });
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
            publicaciones: publicaciones,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
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
    publicacionesCompradas,
    publicacionesFilterQuery,
};