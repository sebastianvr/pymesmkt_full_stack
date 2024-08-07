const { response, request } = require('express');
const { validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');
const { uid } = require('uid');

const Publicacion = require('../models/publicacion');
const Usuario = require('../models/usuario');
const Reclamo = require('../models/reclamo');
const Pyme = require('../models/pyme');


const reclamosGetAll = async (req = request, res = response) => {
    console.log('[reclamos] reclamosGetAll()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const baseFilter = {
        estado: true,
        mensajeAdmin : null,
    };

    const additionalFilters = [];

    if (req.query.nombre) {
        additionalFilters.push({
            [Op.or]: [
                { '$Usuario.Pyme.nombrePyme$': { [Op.like]: `%${req.query.nombre.toLowerCase()}%` } },
                { '$Publicacion.Usuario.Pyme.nombrePyme$': { [Op.like]: `%${req.query.nombre.toLowerCase()}%` } }
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
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Reclamo.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Reclamo.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Reclamo.createdAt')), year),
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
        const { count, rows: reclamos } = await Reclamo.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    where: { estado: true },
                    include: [
                        {
                            model: Pyme,
                            as: 'Pyme',
                            where: { estado: true },
                        },
                    ],
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

        if (!reclamos.length) {
            if (additionalFilters.length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    reclamos: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron reclamos.',
                    reclamos: [],
                });
            }
        }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            reclamos,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamosGetAll().',
            error
        });
    }
};

const reclamosFinishedGetAll = async (req = request, res = response) => {
    console.log('[reclamos] reclamosFinishedGetAll()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const baseFilter = {
        estado: true,
        mensajeAdmin: { [Op.ne]: null } // Verifica que mensajeAdmin no sea nulo o vacío
    };

    const additionalFilters = [];

    if (req.query.nombre) {
        additionalFilters.push({
            [Op.or]: [
                { '$Usuario.Pyme.nombrePyme$': { [Op.like]: `%${req.query.nombre.toLowerCase()}%` } },
                { '$Publicacion.Usuario.Pyme.nombrePyme$': { [Op.like]: `%${req.query.nombre.toLowerCase()}%` } }
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
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Reclamo.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Reclamo.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Reclamo.createdAt')), year),
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
        const { count, rows: reclamos } = await Reclamo.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Usuario,
                    as: 'Usuario',
                    where: { estado: true },
                    include: [
                        {
                            model: Pyme,
                            as: 'Pyme',
                            where: { estado: true },
                        },
                    ],
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

        if (!reclamos.length) {
            if (additionalFilters.length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    reclamos: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron reclamos.',
                    reclamos: [],
                });
            }
        }

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            reclamos,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamosFinishedGetAll().',
            error
        });
    }
};

const reclamoPost = async (req = request, res = response) => {
    console.log('[reclamos] reclamoPost()');

    const myId = uid(15);
    const {
        titulo,
        mensaje,
        documentos,
        mensajeAdmin,
        PublicacionId,
        UsuarioId,
        CompraId
    } = req.body;

    const nuevoReclamo = {
        id: myId,
        titulo,
        mensaje,
        documentos,
        mensajeAdmin,
        PublicacionId,
        UsuarioId,
        CompraId
    };

    try {
        const { id } = await Reclamo.create(nuevoReclamo);

        return res.status(200).json({
            ok: true,
            msg: 'Nuevo reclamo creado',
            id
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamoPost().',
            error
        });
    };
};

const reclamoPut = (req = request, res = response) => {
    console.log('[reclamos] reclamoPut()');

    try {
        const { id } = req.params;
        // console.log({ id });

        return res.status(200).json({
            ok: true,
            id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamoPut()',
            error
        });
    }
};

const reclamoDelete = async (req = request, res = response) => {
    console.log('[reclamos] reclamoDelete()');

    try {
        const { id } = req.params;
        const reclamo = await Reclamo.update({ estado: 0 }, {
            where: { id }
        });

        return res.status(200).json({
            ok: true,
            msg: 'Reclamo eliminado de la bd',
            reclamo,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamoDelete()',
        });
    };
};

const reclamoUpdateAdminMessage = async (req = request, res = response) => {
    console.log('[reclamos] reclamoUpdateAdminMessage()');

    try {
        const { id } = req.params;
        const { mensajeAdmin } = req.body;

        // Verificar si el reclamo existe
        const reclamoExistente = await Reclamo.findOne({ where: { id } });
        if (!reclamoExistente) {
            return res.status(404).json({
                ok: false,
                msg: 'Reclamo no encontrado',
            });
        }

        // Actualizar el mensaje del admin
        await Reclamo.update({ mensajeAdmin }, {
            where: { id }
        });

        return res.status(200).json({
            ok: true,
            msg: 'Mensaje del admin actualizado exitosamente',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, reclamoUpdateAdminMessage()',
        });
    }
};

const getFileReport = async (req = request, res = response) => {
    console.log('[oferta] getFileReport()');
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            ok: false,
            msg: 'El id es obligatorio',
        });
    }

    try {
        const oferta = await Reclamo.findByPk(IdOferta, {
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
            msg: 'Error en el servidor,  getFileReport()',
            error,
        });
    }
}

module.exports = {
    reclamosGetAll,
    reclamoPost,
    reclamoPut,
    reclamoDelete,
    reclamoUpdateAdminMessage,
    reclamosFinishedGetAll,
    getFileCompra: getFileReport
};