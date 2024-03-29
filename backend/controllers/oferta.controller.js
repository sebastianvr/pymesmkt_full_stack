const { validationResult } = require('express-validator');
const { response, request } = require('express');
const { uid } = require('uid');
const { Sequelize } = require('sequelize');

const Usuario = require('../models/usuario');
const Oferta = require('../models/oferta');
const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');


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
                    where: { estado: true },
                    // include : { 
                    //     model :  Pyme,
                    //     where
                    // }
                }
            ]
        });

        // console.log(oferta)
        if (!oferta) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe oferta con este id',
            });
        }

        res.status(200).json({
            ok: true,
            oferta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error,
            msg: 'Error en ofertaGetById()',
        });
    }
}

// Obtiene ofertas recibidas de un usuario, usando su id
const ofertasRecibidasGetById = async (req = request, res = response) => {
    console.log('[ofertas] ofertasRecibidasGetById()')
    const { idUsuario } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    // aqui esta mal
    // debo buscar ofertasRecibidasGetById mas bien es get ofertas recibidas a un UsuarioId O ALGO ASI
    const filter = {
        UsuarioId: idUsuario,
        estado: true,
        procesoDeOferta: 'DISPONIBLE',
    };

    if (req.query.mensaje) {
        filter.mensaje = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('mensaje')),
                {
                    [Sequelize.Op.like]: `%${req.query.mensaje.toLowerCase()}%`,
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

            filter.createdAt = {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), year),
                ]
            };
        }
    }

    console.log({ filter });
    try {
        const { count, rows } =
            await Oferta.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: Usuario,
                        where: { estado: 1 },
                        include: [{
                            model: Pyme,
                            where: { estado: 1 }
                        }]
                    },
                    {
                        model: Publicacion,
                        where: { estado: 1 },
                        include: [
                            {
                                model: Usuario,
                                where: { estado: 1 },
                                include: [{
                                    model: Pyme,
                                    where: { estado: 1 }
                                }]
                            },
                        ]
                    }
                ]
            });


        console.log({ count, rows });

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
        console.error({ error });
        return res.status(500).json(
            { error: 'Error en el servidor' },
            error,
        );
    }
}

// Obtiene ofertas creadas de un usuario, usando su id
const ofertasCreadasGetById = async (req = request, res = response) => {
    console.log('[ofertas] ofertasCreadasGetById()');

    const { UsuarioId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const filter = {
        UsuarioId,
        estado: true,
        procesoDeOferta: 'DISPONIBLE'
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

        console.log({ count, rows });

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
        console.error({ error });
        return res.status(500).json(
            { error: 'Error en el servidor' },
            error,
        );
    }
}

const ofertaPost = async (req = request, res = response) => {
    console.log('[ofertas] ofertaPost()');
    const { mensaje, precioOferta, PublicacionId, UsuarioId } = req.body;

    nuevaOferta = {
        id: uid(15),
        mensaje,
        precioOferta,
        PublicacionId, /** Id de la publicación */
        UsuarioId, /** Id del usuario dueño de la oferta */
    };

    try {
        const createdOferta = await Oferta.create(nuevaOferta);
        res.status(200).json({
            ok: true,
            msg: 'Oferta creada',
            oferta: createdOferta,
        });

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            ok: false,
            msg: error,
        });
    }
}

// actualiza el estado de compra de una oferta a traves de su id
const ofertaPagada = async (req = request, res = response) => {
    console.log('[oferta] ofertaPagada()');
    const { id } = req.params;

    try {
        const oferta = await Oferta.update({ procesoDeOferta: 'FINALIZADA' }, {
            where: { id },
        });

        if (oferta[0] === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe oferta con este id',
                id,
            });
        } else {
            return res.status(200).json({
                ok: true,
                msg: 'La oferta fue modificada correctamente',
            });
        }

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            ok: false,
            msg: 'error en ofertaPagada()',
            error,
        });
    }
}

const ofertaPut = (req = request, res = response) => {
    console.log('[oferta] ofertaPut()');
    const { id } = req.params;
    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id,
    });
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

        res.status(200).json({
            ok: true,
            msg: 'Oferta eliminada',
            oferta,
        });

    } catch (error) {
        console.log({ error });
        res.status(400).json({
            ok: false,
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
    ofertaPagada,
};