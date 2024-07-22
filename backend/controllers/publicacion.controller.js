const { validationResult } = require('express-validator');
const { response, request } = require('express');
const { Sequelize } = require('sequelize');
const { uid } = require('uid');

const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');
const Usuario = require('../models/usuario');
const Calificacion = require('../models/calificacion');


const publicacionesGetAll = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionesGetAll()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const publicaciones = await Publicacion.findAndCountAll({
            where: {
                estado: true,
                procesoDePublicacion: 'INICIADA',
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
                            group: ['nombrePyme'],
                        },
                    ],
                },
            ],
        });

        if (!publicaciones.length) {
            if (additionalFilters.length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    publicaciones: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron publicaciones.',
                    publicaciones: [],
                });
            }
        }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            content: publicaciones.rows,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msj: 'Error en el servidor, publicacionesGetAll()',
            error
        });
    }
}

const publicacionGet = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionGet()');

    const { id } = req.params;
    try {
        const publicacion = await Publicacion.findByPk(id, {
            where: { estado: true },
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
                        // {
                        //     model: Calificacion,
                        //     // where: { estado: true },
                        //     // attributes: ['puntaje', [db.fn('AVG', db.col('puntaje')), 'promedio']],
                        //     // group: ['Pyme.id', 'Usuario.id', 'Publicacion.id'],
                        //     attributes: ['puntaje']
                        // },
                    ],
                }
            ],
        })

        // console.log({ publicacion });
        if (!publicacion) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe publicación',
            });
        }

        return res.status(200).json({
            ok: true,
            publicacion,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, publicacionGet()',
            error
        });
    }
}

const publicacionesGet = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionesGet()')

    const { idUsuario } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const baseFilter = {
        UsuarioId: idUsuario,
        estado: true,
        procesoDePublicacion: 'INICIADA'
    };

    const additionalFilters = {};

    if (req.query.titulo) {
        additionalFilters.titulo = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('titulo')),
                {
                    [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
                },
            ],
        };
    };

    if (req.query.fecha) {
        // Verificamos que la fecha cumpla con el formato "DD-MM-YYYY"
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(req.query.fecha)) {
            // Si la fecha es válida, podemos incluirla en la consulta
            const fechaParts = req.query.fecha.split('-');
            const day = parseInt(fechaParts[0], 10);
            const month = parseInt(fechaParts[1], 10);
            const year = parseInt(fechaParts[2], 10);

            // Ajusta el nombre de los campos de fecha según tu modelo
            additionalFilters.createdAt = {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), year),
                ]
            };
        }
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters
    };

    // console.log({ filter });
    try {
        const { count, rows: publicaciones } =
            await Publicacion.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

        if (!publicaciones.length) {
            if (Object.keys(additionalFilters).length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    publicaciones: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron publicaciones.',
                    publicaciones: [],
                });
            }
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            publicaciones,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, publicacionesGet().',
            error
        });
    }

}

const publicacionPost = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionPost()');

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
    };

    // console.log(nuevaPublicacion);
    try {
        const { id } = await Publicacion.create(nuevaPublicacion);
        return res.status(200).json({
            ok: true,
            msg: 'Nueva publicación creada',
            id
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en el servidor al crear publicación.',
            error
        });
    }
}

const publicacionPut = (req = request, res = response) => {
    console.log('[publicaciones] publicacionPut()');

    const { id } = req.params;
    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id
    })
}

const publicacionPagada = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionPagada()');

    const { id } = req.params;
    try {
        const publicacion = await Publicacion.update({ procesoDePublicacion: 'FINALIZADA' }, {
            where: { id },
        });

        if (publicacion[0] === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe publicación con este id',
                id,
            });
        } else {
            return res.status(200).json({
                ok: true,
                msg: 'Publicación fue modificada correctamente',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, publicacionPagada()',
            error,
        });
    }
}

const publicacionDelete = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionDelete()');

    const { id } = req.params;
    try {
        const publicacion = await Publicacion.update({ estado: 0 }, {
            where: { id },
        });

        return res.status(200).json({
            ok: true,
            msg: 'Publicación eliminada de la bd',
            publicacion,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar publicación.',
            error,
        });
    }
}

const publicacionesCompradas = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionesCompradas()');

    const { idUsuario } = req.params;
    const { page, size } = req.query;

    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber;
        }

        let size = 10;
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber;
        }

        const publicacion = await Publicacion.findAndCountAll({
            limit: size,
            offset: page * size,
            where: {
                estado: true,
                UsuarioId: idUsuario,
                procesoDePublicacion: 'FINALIZADA',
            },
            order: [['createdAt', 'DESC']],
        });


        if (publicacion.count === 0) {
            return res.status(200).json({
                ok: true,
                publicacion,
                msg: 'No existen publicaciones compradas de este usuario',
            });
        }

        if (publicacion.count > 0) {
            return res.status(200).json({
                ok: true,
                totalPages: Math.ceil(publicacion.count / size),
                content: publicacion.rows,
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error al buscar publicaciones compradas.',
            error
        });
    }
}

const publicacionesFilterQuery = async (req = request, res = response) => {
    console.log('[publicaciones] publicacionesFilterQuery()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const baseFilter = {
        estado: true,
        procesoDePublicacion: "INICIADA",
    };

    const additionalFilters = {};

    // if (req.query.titulo) {
    //     console.log(req.query.titulo);
    //     additionalFilters.titulo = {
    //         [Sequelize.Op.and]: [
    //             Sequelize.fn('LOWER', Sequelize.col('titulo')),
    //             {
    //                 [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
    //             },
    //         ],
    //     };
    // };
    if (req.query.titulo) {
        console.log(req.query.titulo);
        additionalFilters.titulo = {
            [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
        };
    };
    

    if (req.query.id) {
        additionalFilters.id = req.query.id;
    };

    if (req.query.cantidadOfertasRecibidas) {
        additionalFilters.cantidadOfertasRecibidas = {
            [Sequelize.Op.lte]: parseInt(req.query.cantidadOfertasRecibidas),
        };
    };

    if (req.query.precioTotal) {
        additionalFilters.precioTotal = {
            [Sequelize.Op.lte]: parseInt(req.query.precioTotal),
        };
    };

    if (req.query.garantia) {
        additionalFilters.garantia = (req.query.garantia === "true");
    };

    if (req.query.productoOServicio) {
        additionalFilters.productoOServicio = req.query.productoOServicio;
    };

    const filter = {
        ...baseFilter,
        ...additionalFilters
    };

    // console.log({ filter });
    try {
        const { count, rows: publicaciones } =
            await Publicacion.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: Usuario,
                        where: { estado: true },
                        attributes: ['nombreUsuario', 'id', 'apellidos'],
                        include: [
                            {
                                model: Calificacion,
                            },
                            {
                                model: Pyme,
                                where: { estado: true },
                                attributes: ['nombrePyme'],
                                group: ['nombrePyme'],
                            },
                        ],
                    },
                ],
            });

            // console.log(publicaciones,additionalFilters);
            if (!publicaciones.length) {
                if (Object.keys(additionalFilters).length > 0) {
                    return res.status(200).json({
                        message: 'No se encontraron coincidencias para los filtros aplicados.',
                        noSearchMatch: true,
                        publicaciones: []
                    });
                } else {
                    return res.status(200).json({
                        message: 'No se encontraron publicaciones.',
                        publicaciones: [],
                    });
                }
            }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            publicaciones,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msj: 'Error en el servidor, publicacionesFilterQuery()',
            error
        });
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