const { faker } = require('@faker-js/faker/locale/es');
const { uid } = require('uid');

const Compra = require("../../models/compra");
const Oferta = require("../../models/oferta");
const Publicacion = require("../../models/publicacion");

const comprarOferta = async (usuarioId, oferta) => {
    try {
        const compra = await Compra.create({
            id: uid(15),
            precio: oferta.precioOferta,
            codAutorizacion: faker.string.alphanumeric(11),
            UsuarioId: usuarioId,
            OfertumId: oferta.id,
            PublicacionId: oferta.PublicacionId,
            estado: true,
        });

        // Actualizar estado de la oferta a 'FINALIZADA'
        await Oferta.update(
            { procesoDeOferta: 'FINALIZADA' },
            { where: { id: oferta.id } }
        );

        // Obtener y actualizar estado de la publicación relacionada si existe
        const publicacion = await Publicacion.findByPk(oferta.PublicacionId);

        if (publicacion) {
            await Publicacion.update(
                { procesoDePublicacion: 'FINALIZADA' },
                { where: { id: oferta.PublicacionId } }
            );
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
};

module.exports = comprarOferta;