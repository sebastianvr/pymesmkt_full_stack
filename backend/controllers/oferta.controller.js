const { validationResult } = require('express-validator');
const { response, request } = require('express');
const { Sequelize, Op } = require('sequelize');
const { uid } = require('uid');

const Usuario = require('../models/usuario');
const Oferta = require('../models/oferta');
const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');
const { getOfferFile } = require('./s3.controller');


const ofertaGetById = async (req = request, res = response) => {
    console.log('[ofertas] ofertaGetById()')
    const { IdOferta } = req.params;

    if (!IdOferta) {
        return res.status(400).json({
            ok: false,
            msg: 'El id es obligatorio',
        });
    }

    try {
        const oferta = await Oferta.findByPk(IdOferta, {
            include: [
                {
                    model: Publicacion,
                    where: { estado: true },
                },
                {
                    model: Usuario,
                    where: { estado: true }
                }
            ]
        });

        if (!oferta) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe oferta con este id',
            });
        }

        return res.status(200).json({
            ok: true,
            oferta,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor,  ofertaGetById()',
            error,
        });
    }
}

const ofertasRecibidasGetById = async (req = request, res = response) => {
    console.log('[ofertas] ofertasRecibidasGetById()');

    const { idUsuario } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const baseFilter = {
        estado: true,
        procesoDeOferta: 'DISPONIBLE',
        usuarioIdReceptor: idUsuario,
    }

    const additionalFilters = [];

    if (req.query.titulo) {
        additionalFilters.push({
            [Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Publicacion.titulo')), {
                    [Op.like]: `%${req.query.titulo.toLowerCase()}%`
                })
            ]
        });
    }

    if (req.query.fecha) {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(req.query.fecha)) {
            const fechaParts = req.query.fecha.split('-');
            const day = parseInt(fechaParts[0], 10);
            const month = parseInt(fechaParts[1], 10);
            const year = parseInt(fechaParts[2], 10);
            // console.log('Parsed Date:', { day, month, year });

            additionalFilters.push({
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Publicacion.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Publicacion.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Publicacion.createdAt')), year),
                ],
            });
        }
    }

    if (req.query.pyme) {
        additionalFilters.push({
            [Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Usuario.Pyme.nombrePyme')), {
                    [Op.like]: `%${req.query.pyme.toLowerCase()}%`
                })
            ]
        });
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters.length > 0 ? { [Op.and]: additionalFilters } : {},
    };

    try {
        const { count, rows: ofertas } = await Oferta.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            include: [
                {
                    model: Publicacion,
                    where: {
                        estado: true,
                        procesoDePublicacion: 'INICIADA'
                    },
                    include: [{
                        model: Usuario,
                        where: { estado: true },
                        attributes: ['nombreUsuario'],
                        include: [{
                            model: Pyme,
                            where: { estado: true },
                            attributes: ['nombrePyme'],
                        }]
                    }]
                }, {
                    model: Usuario,
                    include: [{
                        model: Pyme,
                        where: { estado: true },
                        attributes: ['nombrePyme'],
                    }]
                }
            ],
        });

        if (!ofertas.length) {
            if (additionalFilters.length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    ofertas: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron ofertas recibidas.',
                    ofertas: [],
                });
            }
        }

        // Agrupar ofertas por publicación
        const offersByPublication = {};
        ofertas.forEach(oferta => {
            const publicationId = oferta.Publicacion.id;
            if (!offersByPublication[publicationId]) {
                offersByPublication[publicationId] = {
                    publicacion: oferta.Publicacion,
                    ofertas: []
                };
            }
            offersByPublication[publicationId].ofertas.push(oferta);
        });

        // Convertir el objeto a un arreglo
        const resultadosAgrupados = Object.values(offersByPublication);
        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            ofertas: resultadosAgrupados,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msj: 'Error en el servidor',
            error
        });
    }
}

const ofertasCreadasGetById = async (req = request, res = response) => {
    console.log('[ofertas] ofertasCreadasGetById()');

    const { UsuarioId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const baseFilter = {
        UsuarioId,
        estado: true,
        procesoDeOferta: 'DISPONIBLE'
    };

    const additionalFilters = [];

    if (req.query.mensaje) {
        additionalFilters.push({
            [Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Oferta.mensaje')), {
                    [Op.like]: `%${req.query.mensaje.toLowerCase()}%`
                })
            ]
        });
    }

    if (req.query.fecha) {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(req.query.fecha)) {
            const fechaParts = req.query.fecha.split('-');
            const day = parseInt(fechaParts[0], 10);
            const month = parseInt(fechaParts[1], 10);
            const year = parseInt(fechaParts[2], 10);
            // console.log('Parsed Date:', { day, month, year });

            additionalFilters.push({
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Oferta.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Oferta.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Oferta.createdAt')), year),
                ],
            });
        }
    }

    if (req.query.pyme) {
        additionalFilters.push({
            [Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Publicacion.Usuario.Pyme.nombrePyme')), {
                    [Op.like]: `%${req.query.pyme.toLowerCase()}%`
                })
            ]
        });
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters.length > 0 ? { [Op.and]: additionalFilters } : {},
    };

    try {
        const { count, rows } =
            await Oferta.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: Publicacion,
                        where: {
                            estado: true,
                            procesoDePublicacion: 'INICIADA'
                        },
                        include: [{
                            model: Usuario,
                            where: { estado: true },
                            attributes: ['nombreUsuario'],
                            include: [{
                                model: Pyme,
                                where: { estado: true },
                                attributes: ['nombrePyme'],
                            }]
                        }]
                    }
                ],
            });

        // console.log({ count, rows });
        if (!rows.length) {
            return res.status(200).json({
                message: 'No se encontraron coincidencias.',
                rows: [],
            });
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            rows,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msj: 'Error en el servidor, ofertasCreadasGetById()',
            error
        });
    }
}

const ofertaPost = async (req = request, res = response) => {
    console.log('[ofertas] ofertaPost()');

    const {
        mensaje,
        precioOferta,
        archivo,
        PublicacionId,
        usuarioIdReceptor,
        UsuarioId
    } = req.body;

    const newOffer = {
        id: uid(15),
        mensaje,
        precioOferta,
        archivo,
        PublicacionId, /** Id de la publicación */
        usuarioIdReceptor,
        UsuarioId,
    };

    try {
        const createdOffer = await Oferta.create(newOffer);

        // Incrementar la cantidad de ofertas recibidas en la publicación
        await Publicacion.increment('cantidadOfertasRecibidas', { where: { id: PublicacionId } });

        return res.status(200).json({
            ok: true,
            msg: 'Oferta creada',
            oferta: createdOffer
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, ofertaPost()',
            error
        });
    }
}

const getVentas = async (req = request, res = response) => {
    console.log('[oferta] getVentas()');

    const { UsuarioId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const baseFilter = {
        UsuarioId,
        procesoDeOferta: 'FINALIZADA'
    };

    const additionalFilters = [];

    if (req.query.mensaje) {
        additionalFilters.push({
            [Op.or]: [
                Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('mensaje')), {
                    [Op.like]: `%${req.query.mensaje.toLowerCase()}%`
                })
            ]
        });
    }

    if (req.query.fecha) {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(req.query.fecha)) {
            const fechaParts = req.query.fecha.split('-');
            const day = parseInt(fechaParts[0], 10);
            const month = parseInt(fechaParts[1], 10);
            const year = parseInt(fechaParts[2], 10);
            // console.log('Parsed Date:', { day, month, year });

            additionalFilters.push({
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Oferta.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Oferta.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Oferta.createdAt')), year),
                ],
            });
        }
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters.length > 0 ? { [Op.and]: additionalFilters } : {},
    };
    // console.log({ filter });

    try {

        const { count, rows: ventas } = await Oferta.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    where: { estado: true },
                },
                {
                    model: Publicacion,
                    as: 'Publicacion',
                    where: { estado: true },
                    include: [
                        {
                            model: Usuario,
                            as: 'Usuario',
                            where: { estado: true },
                            attributes: ['nombreUsuario'],
                            include: {
                                model: Pyme,
                                as: 'Pyme',
                                where: { estado: true },
                                attributes: ['nombrePyme'],
                            },
                        },
                    ],
                },
            ],
        });

        if (!ventas.length) {
            if (additionalFilters.length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    ventas: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron ofertas.',
                    ventas: [],
                });
            }
        }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            ventas,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, getVentas().',
            error
        });
    }
}

const ofertaPut = (req = request, res = response) => {
    console.log('[oferta] ofertaPut()');

    const { id } = req.params;
    try {
        return res.status(200).json({
            ok: true,
            msg: 'Put Api desde controlador',
            id,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, ofertaPut()',
            error
        });

    }
}

const ofertaDelete = async (req = request, res = response) => {
    console.log('[oferta] ofertaDelete()');

    const { id } = req.params;
    try {
        const oferta = await Oferta.update(
            { estado: 0 },
            {
                where: {
                    estado: 1,
                    id,
                }
            }
        );

        return res.status(200).json({
            ok: true,
            msg: 'Oferta eliminada',
            oferta,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, ofertaDelete()',
            error
        });
    }
}

const getFileOferta = async (req = request, res = response) => {
    console.log('[oferta] fileOferta()');
    const { IdOferta } = req.params;

    if (!IdOferta) {
        return res.status(400).json({
            ok: false,
            msg: 'El id es obligatorio',
        });
    }

    try {
        const oferta = await Oferta.findByPk(IdOferta, {
            attributes: ['archivo']
        });

        if (!oferta) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe oferta con este id',
            });
        }

        if (oferta.archivo) {
            const url = await getOfferFile(oferta.archivo);
            oferta.archivo = url;
        }

        return res.status(200).json({
            ok: true,
            oferta,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor,  fileOferta()',
            error,
        });
    }
}

module.exports = {
    ofertaGetById,
    ofertasRecibidasGetById,
    ofertasCreadasGetById,
    ofertaPost,
    ofertaPut,
    ofertaDelete,
    getVentas,
    getFileOferta,
};