const { uid } = require('uid');
const { response, request } = require('express');

const Compra = require('../models/compra');
const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Oferta = require('../models/oferta');
const Pyme = require('../models/pyme');
const Calificacion = require('../models/calificacion');



const dataGraphGet = async (req = request, res = response) => {

    try {
        const colaboraciones = await Compra.findAll({
            where: { estado: true },
            attributes: [
                'id',
                // [Compra.fn('COUNT', Compra.col('hats')), 'n_hats']
            ],
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
        })

        // console.log('colaboraciones', colaboraciones)

        // Obtengo todos los nodos, formateando la data
        const nodes = getNodes(colaboraciones);

        // Obtengo todos los links, formateando la data
        const links = getLinks(colaboraciones);

        return res.status(200).json({
            ok: true,
            nodes,
            links
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error,
            msg: 'Error en dataGraphGet()',
        });
    }
}


/**
 * 
 *  Identificar todos los NODOS existentes
        Formato  
            nodes : [
                id : 1,
                name : EmpresaName
            ]

            Donde : 
                id :  identificador unico del nodo
                name :  nombre de la empresa
 * @param {*} compras
 * @returns 
 * Arreglo con todos los nodos ordenados Alfabeticamente descendentemente
 */
function getNodes(compras) {

    /**
        * Añado un tipo de dato diccionario usando Set para guardar 
        * SOLO ELEMENTOS QUE NO SE REPITEN
     */
    let nodes = new Set();

    // Iteracion y obtencion de todos los nodos
    compras.forEach((compra, index) => {
        /** 
         *  DESESTRUCTURACION DEL OBJETO Y RENOMBRE PARA 
         *      nombrePyme  = comprador
         *      Pyme        = vendedor
        */
        const {
            Usuario: {
                Pyme: { nombrePyme: comprador }
            },
            Ofertum: {
                Usuario: { Pyme: { nombrePyme: vendedor } }
            }
        } = compra

        // Añado todos los participantes al diccionario nodes
        nodes.add(comprador.toLowerCase().trim());
        nodes.add(vendedor.toLowerCase().trim());
    });

    
    // console.log('nodes', nodes)
    nodes = Array.from(nodes)
    
    // Transformo el diccionario a arreglo
    const newNodes = []
    for (let index = 0; index < nodes.length; index++) {
        newNodes.push({
            id: nodes[index]
        })
    }

    return newNodes
}

/**
 *  
 *   Identificar todas las RELACIONES existentes
           Formato de salida  
               links : [
                   source : 1,
                   target : 4,
                   type : # 
               ]
            
            Donde : 
               souce :  nodo con id 1
               target :  nodo con id 4
               target :  número de veces que se repite la relación
 * @param {*} compras
 * @returns 
 * Arreglo con todos los links
 */
function getLinks(compras) { 

    let links = [];
    let data = [];

    // Limpiar la informacion
    compras.forEach((compra, index) => {
        /** 
         *  DESESTRUCTURACION DEL OBJETO Y RENOMBRE PARA 
         *      nombrePyme  = comprador
         *      Pyme        = vendedor
        */
        const {
            Usuario: {
                Pyme: { nombrePyme: comprador }
            },
            Ofertum: {
                Usuario: { Pyme: { nombrePyme: vendedor } }
            }
        } = compra

        data.push(`${comprador.toLowerCase().trim()}-${vendedor.toLowerCase().trim()}`)
    });

    let contador = 1;
    for (let index = 0; index < data.length; index++) {

        if (data[index] === data[index + 1]) {
            contador++
        } else {
            links.push({
                source: data[index].split('-').shift(),
                target: data[index].split('-').pop(),
                type: contador
            })
            contador = 1;
        }
    }
    return links
}

const comprasGetById = async (req = request, res = response) => {

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

        // console.log(compras)
        // console.log('comprasGetById()', compras)
        if (compras.count === 0) {
            return res.status(200).json({
                ok: true,
                compras,
                msg: 'No existen compras de este usuario'
            })
        }

        if (compras.count > 0) {
            return res.status(200).json({
                ok: true,
                totalPages: Math.ceil(compras.count / size),
                content: compras.rows,
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

const compraPost = async (req = request, res = response) => {

    const { precio, codAutorizacion, PublicacionId, UsuarioId, OfertumId } = req.body
    const myId = uid(15);

    nuevaCompra = {
        id: myId,
        precio,
        codAutorizacion,
        // Id de la publicación
        PublicacionId,
        //Id del usuario dueño de la compra
        UsuarioId,
        //Id de la oferta pagada
        OfertumId
    }

    try {

        // comprobar si existe una compra para la misma publicacion 
        const existePublicacion = await Compra.findOne({ where: { PublicacionId } });
        // console.log(publicacion)
        if (!existePublicacion) {
            await Compra.create(nuevaCompra);

            return res.status(200).json({
                ok: true,
                msg: 'Nueva compra creada'
            })
        } else {

            return res.status(400).json({
                ok: false,
                msg: 'No se puede comprar una publicacion que ya fue pagada anteriormente.',
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en compraPost()',
            msg: error
        })
    }

}


module.exports = {
    compraPost,
    dataGraphGet,
    comprasGetById
};