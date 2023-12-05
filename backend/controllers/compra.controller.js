const { uid } = require('uid');
const { response, request } = require('express');

const Compra = require('../models/compra');
const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Oferta = require('../models/oferta');
const Pyme = require('../models/pyme');

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

        const nodes = await getNodes();
        const links = getLinks(colaboraciones);

        return res.status(200).json({
            ok: true,
            nodes,
            links,
        });

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            ok: false,
            error,
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
const getLinks = (compras) => {
    let links = [];
    let data = [];

    // Mapping and cleaning data
    compras.forEach((compra) => {
        /** 
         *  Desestructuración del objeto y renombre de relaciones: 
         *      nombrePyme  = comprador
         *      Pyme        = vendedor
        */
        const {
            Usuario: {
                Pyme: {
                    nombrePyme: comprador
                }
            },
            Ofertum: {
                Usuario: {
                    Pyme: { nombrePyme: vendedor }
                }
            }
        } = compra;

        data.push(`${comprador.toLowerCase().trim()}-${vendedor.toLowerCase().trim()}`)
    });

    let contador = 1;
    for (let index = 0; index < data.length; index++) {

        if (data[index] === data[index + 1]) {
            contador++;
        } else {
            links.push({
                source: data[index].split('-').shift(),
                target: data[index].split('-').pop(),
                type: contador
            })
            contador = 1;
        }
    }
    return links;
}

const getNodes = async () => {
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

    return newNodes;
}

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

const comprasGetById = async (req = request, res = response) => {
    console.log('[compra] comprasGetById()');

    const { UsuarioId } = req.params;
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

        const compras = await Compra.findAndCountAll({
            limit: size,
            offset: page * size,
            order: [['createdAt', 'DESC'],],
            where: {
                UsuarioId,
                estado: true,
            },
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
                    // attributes : ['id', 'nombreUsuario'],
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
                        // attributes : ['id', 'nombreUsuario'],
                        include: [{
                            model: Pyme,
                            where: { estado: true },
                        }]
                    }]

                },
            ]
        })

        if (compras.count === 0) {
            return res.status(200).json({
                ok: true,
                compras,
                msg: 'No existen compras de este usuario',
            });
        }

        if (compras.count > 0) {
            return res.status(200).json({
                ok: true,
                totalPages: Math.ceil(compras.count / size),
                content: compras.rows,
            });
        }

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            ok: false,
            msg: error,
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
        OfertumId
    } = req.body

    const myId = uid(15);

    nuevaCompra = {
        id: myId,
        precio,
        codAutorizacion,
        PublicacionId, /* Id de la publicación */
        UsuarioId, /* Id del usuario dueño de la compra */
        OfertumId /* Id de la oferta pagada */
    }

    try {

        // comprobar si existe una compra para la misma publicacion 
        const existePublicacion = await Compra.
            findOne({
                where: { PublicacionId }
            });

        if (existePublicacion) {
            return res.status(400).json({
                ok: false,
                msg: 'Esta publicación que ya fue pagada.',
            });
        }

        await Compra.create(nuevaCompra);

        return res.status(200).json({
            ok: true,
            msg: 'Nueva compra creada',
        });

    } catch (error) {
        console.log({ error });
        res.status(500).json({
            ok: false,
            msg: 'Error en compraPost()',
            msg: error,
        });
    }
}

module.exports = {
    compraPost,
    dataGraphGet,
    comprasGetById,
};