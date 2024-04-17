const { uid } = require('uid');
const { response, request } = require('express');

const Publicacion = require('../models/publicacion');
const Usuario = require('../models/usuario');
const Reclamo = require('../models/reclamo');
const Pyme = require('../models/pyme');

/**
 * Obtiene todos los reclamos de TODOS los usuarios.
 * @param {request} req 
 * @param {response} res 
 */
const reclamosGetAll = async (req = request, res = response) => {
    const { page, size } = req.query;
    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber;
        };

        let size = 10;
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 100) {
            size = sizeAsNumber;
        };

        let reclamos = await Reclamo.findAndCountAll({
            where: { estado: true },
            limit: size,
            offset: page * size,
            order: [['createdAt', 'DESC']],
            include: [
                // usuario que recibe el reclamo
                {
                    model: Usuario,
                    where: { estado: true },
                    include: [
                        {
                            model: Pyme,
                            where: { estado: true },
                            // attributes: ['nombrePyme'],
                        },
                        // {
                        //     model: Reclamo,
                        //     where: { estado: true },

                        //     // attributes: [db.fn('COUNT', db.col('Usuario.Reclamos.id')), 'Usuario.Reclamos.id'],
                        //     group: ['id']
                        //     // attributes: ['id', [db.fn('COUNT', 0), 'cantidad']],
                        // },
                    ]
                    // attributes: ['nombreUsuario','promedio',[db.fn('COUNT', db.col('puntaje')), 'promedio']],
                },
                {
                    model: Publicacion,
                    where: { estado: true },
                    // attributes: ['UsuarioId', 'id'],
                    include: [
                        // usuario creador del reclamo
                        {
                            model: Usuario,
                            where: { estado: true },
                            attributes: ['nombreUsuario'],
                            include: {
                                model: Pyme,
                                where: { estado: true },
                                attributes: ['nombrePyme'],
                            },
                        },
                    ],
                },
            ],
        });

        // console.log({reclamos});
        // if (reclamos.count === 0) {
        //     res.status(200).json({
        //         ok: true,
        //         reclamos,
        //         msg: 'No existen reclamos hacia este usuario'
        //     })
        // }

        if (reclamos.count > 0) {
            res.status(200).json({
                totalPages: Math.ceil(reclamos.count / size),
                content: reclamos.rows,
            });
        };
    } catch (error) {
        // console.log({error})
        res.status(400).json({
            ok: false,
            msj: 'Ocurrio un error en reclamosGetAll()',
            error,
        });
    };
};

const reclamoPost = async (req = request, res = response) => {
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

        res.status(200).json({
            ok: true,
            id,
            msg: 'Nuevo reclamo creado',
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            error,
            msg: 'Error al crear reclamo.',
        });
    };
};

const reclamoPut = (req = request, res = response) => {
    const { id } = req.params;
    // console.log({ id });

    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id,
    });
};

const reclamoDelete = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const reclamo = await Reclamo.update({ estado: 0 }, {
            where: { id },
        });

        res.status(200).json({
            msg: 'Reclamo eliminado de la bd',
            reclamo,
        });
    } catch (error) {
        console.log({ error });
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar reclamo',
        });
    };
};

module.exports = {
    reclamosGetAll,
    reclamoPost,
    reclamoPut,
    reclamoDelete,
};