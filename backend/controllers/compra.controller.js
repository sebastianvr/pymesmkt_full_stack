const { response, request } = require('express');
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { uid } = require('uid');

const Compra = require('../models/compra');
const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Oferta = require('../models/oferta');
const Pyme = require('../models/pyme');
const Reclamo = require('../models/reclamo');

const comprasGetById = async (req = request, res = response) => {
    console.log('[compra] comprasGetById()');

    const { UsuarioId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const baseFilter = {
        UsuarioId,
        estado: true
    };

    const additionalFilters = {};

    // Condición para filtrar por el nombre de la empresa vendedora
    if (req.query.empresa) {
        additionalFilters['$Ofertum.Usuario.Pyme.nombrePyme$'] = {
            [Sequelize.Op.like]: `%${req.query.empresa.toLowerCase()}%`,
        };
    }

    if (req.query.fecha) {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (dateRegex.test(req.query.fecha)) {
            const fechaParts = req.query.fecha.split('-');
            const day = parseInt(fechaParts[0], 10);
            const month = parseInt(fechaParts[1], 10);
            const year = parseInt(fechaParts[2], 10);

            additionalFilters.createdAt = {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DAY', Sequelize.col('Compra.createdAt')), day),
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Compra.createdAt')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Compra.createdAt')), year),
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
        const compras = await Compra.findAndCountAll({
            where: filter,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC'],],
            include: [
                {
                    model: Publicacion,
                    where: {
                        estado: true,
                        procesoDePublicacion: 'FINALIZADA'
                    }
                },
                {
                    // Usuario dueño de la publicacion
                    model: Usuario,
                    where: { estado: true },
                    include: [{
                        model: Pyme,
                        where: { estado: true },
                    }]
                },
                {
                    model: Oferta,
                    where: {
                        estado: true,
                        procesoDeOferta: 'FINALIZADA'
                    },
                    include: [{
                        // Usuario dueño de la oferta
                        model: Usuario,
                        where: { estado: true },
                        include: [{
                            model: Pyme,
                            where: { estado: true },
                        }]
                    }]
                },
                {
                    model: Reclamo,
                    where: {
                        estado: true,
                    },
                    attributes: ['id'],
                    required: false // Hacer que la asociación con Reclamo sea opcional
                }
            ]
        });

        // console.log('compras.rows', compras.rows);
        if (!compras.rows.length) {
            if (Object.keys(additionalFilters).length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    compras: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron compras.',
                    compras: [],
                });
            }
        };

        return res.status(200).json({
            ok: true,
            total: compras.count,
            totalPages: Math.ceil(compras.count / pageSize),
            currentPage: page,
            pageSize,
            compras: compras.rows,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, comprasGetById()',
            msg: error
        });
    }
}

const compraPost = async (req = request, res = response) => {
    console.log('[compra] compraPost()');

    const {
        precio,
        codAutorizacion,
        PublicacionId,
        UsuarioId,
        OfertumId,
    } = req.body;

    const newId = uid(15);

    newPurchase = {
        id: newId,
        precio,
        codAutorizacion,
        PublicacionId, /* Id de la publicación */
        UsuarioId, /* Id del usuario dueño de la compra */
        OfertumId, /* Id de la oferta pagada */
    }

    try {

        // comprobar si existe una compra para la misma publicacion 
        const existPublication = await Compra.findOne(
            { where: { PublicacionId } }
        );

        if (existPublication) {
            return res.status(400).json({
                ok: false,
                msg: 'Esta publicación que ya fue pagada.',
            });
        }

        await Compra.create(newPurchase);

        return res.status(200).json({
            ok: true,
            msg: 'Nueva compra creada',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, compraPost()',
            error
        });
    }
}

const dataGraphGet = async (req = request, res = response) => {
    console.log("[compra] dataGraphGet()");

    try {
        const colaboraciones = await
            Compra.findAll({
                where: { estado: true },
                attributes: ['id'],
                include: [
                    {
                        model: Usuario,
                        where: { estado: true },
                        attributes: ['id'],
                        include: [{
                            model: Pyme,
                            where: { estado: true },
                            attributes: ['id', 'nombrePyme']
                        }]
                    },
                    {
                        model: Oferta,
                        where: { estado: true },
                        attributes: ['id'],
                        include: [{
                            model: Usuario,
                            where: { estado: true },
                            attributes: ['id'],
                            include: [{
                                model: Pyme,
                                where: { estado: true },
                                attributes: ['id', 'nombrePyme']
                            }]
                        }],
                        order: [['nombrePyme', 'DESC']],
                    }
                ],
            });

        // console.log(colaboraciones[0]);
        const nodes = await getNodes();
        const links = getLinks(colaboraciones);

        return res.status(200).json({
            ok: true,
            nodes,
            links
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, dataGraphGet()',
            error
        });
    }
}

/**
 *  Obtiene links en base a las compras realizadas.
     Formato de salida  
        links : [
            source : 1,
            target : 4,
            type : # 
        ]
    
     Donde : 
        souce :  nodo con id 1
        target :  nodo con id 4
        type :  nro de veces que se repite la relación

 * @param {*} compras
 * @returns 
 * Arreglo con todas las colaboraciones como links.
 */
// const getLinks = (compras) => {
//     console.log('getLinks()');
//     // console.log(compras.dataValues);
//     let links = [];
//     let data = [];

//     // Mapping and cleaning data
//     compras.forEach((compra) => {
//         /** 
//          *  Desestructuración del objeto y renombre de relaciones: 
//          *      nombrePyme  = comprador
//          *      Pyme        = vendedor
//         */
//         // const {
//         //     Usuario: {

//         //         Pyme: {
//         //             nombrePyme: comprador,
//         //         },
//         //     },
//         //     Ofertum: {

//         //         Usuario: {
//         //             Pyme: { nombrePyme: vendedor },
//         //         },
//         //     },
//         // } = compra;

//         // data.push(`${compra.Usuario.id} ${comprador.toLowerCase().trim()}-${compra.Ofertum.Usuario.id} ${vendedor.toLowerCase().trim()}`);
//         const compradorId = compra.Usuario.id;
//         const vendedorId = compra.Ofertum.Usuario.id;

//         const comprador = compra.Usuario.Pyme.nombrePyme.toLowerCase().trim();
//         const vendedor = compra.Ofertum.Usuario.Pyme.nombrePyme.toLowerCase().trim();

//         data.push(`${compradorId} ${comprador}-${vendedorId} ${vendedor}`);
//     });


//     let contador = 1;

//     for (let index = 0; index < data.length; index++) {
//         if (data[index] === data[index + 1]) {
//             contador++;
//         } else {
//             const [compradorId, vendedorId] = data[index].split(' ')[0].split('-');
//             links.push({
//                 source: {
//                     index: compradorId,
//                     name: data[index].split('-').shift()
//                 },
//                 target: {
//                     index: vendedorId,
//                     name: data[index].split('-').pop(),
//                 },
//                 type: contador
//             });
//             contador = 1;
//         }
//     }
//     clg
//     return links;
// }

const getNodes = async () => {
    console.log('getNodes()');

    const pymesFound = await Usuario.findAll({
        where: { estado: true },
        attributes: ['id'],
        include: {
            model: Pyme,
            where: { estado: true },
            attributes: ['id', 'nombrePyme']
        },
    });

    let nodes = new Set();
    // console.log({ nodes });
    pymesFound.forEach((node) => {
        const {
            Pyme: {
                id,
                nombrePyme,
            }
        } = node;

        const titleCaseNombrePyme = toTitleCase(nombrePyme);

        nodes.add({
            index: id,
            name: titleCaseNombrePyme.trim(),
        });
    });

    nodes = Array.from(nodes);

    // Transforma el diccionario a arreglo
    const newNodes = [];
    for (let index = 0; index < nodes.length; index++) {
        newNodes.push(nodes[index]);
    }

    // console.log({ newNodes });
    return newNodes;
}

const getLinks = (compras) => {
    console.log('getLinks()');

    let links = [];
    let relationships = {};

    // Mapping and cleaning data
    compras.forEach((compra) => {
        const compradorId = compra.Usuario.id;
        const vendedorId = compra.Ofertum.Usuario.id;

        const comprador = compra.Usuario.Pyme.nombrePyme.toLowerCase().trim();
        const vendedor = compra.Ofertum.Usuario.Pyme.nombrePyme.toLowerCase().trim();

        const key = `${compradorId}-${vendedorId}`;
        const existingRelation = relationships[key];

        if (existingRelation) {
            existingRelation.type++;
        } else {
            relationships[key] = {
                source: {

                    name: toTitleCase(comprador),
                },
                target: {

                    name: toTitleCase(vendedor),
                },
                type: 1,
            };
        }
    });

    // Convert the relationships object to an array of links
    links = Object.values(relationships);
    // console.log(links[0]);
    // console.log({ links });
    return links;
};

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        (txt) => {
            return txt.length > 1 ?
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() :
                txt.toLowerCase();
        }
    );
}

module.exports = {
    compraPost,
    dataGraphGet,
    comprasGetById,
};