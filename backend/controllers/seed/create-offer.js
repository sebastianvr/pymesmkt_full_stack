const { faker } = require('@faker-js/faker/locale/es');
const { uid } = require("uid");
const Oferta = require("../../models/oferta");
const Publicacion = require("../../models/publicacion");

const crearOferta = async (publicacionId, oferenteId, receptorId) => {
    console.log('[seed] crearOferta()');
    try {
        const oferta = {
            id: uid(15),
            mensaje: faker.lorem.paragraph(3,7),
            precioOferta: faker.commerce.price({ min: 5101, max: 22000 }),
            procesoDeOferta: 'DISPONIBLE',
            estado: true,
            usuarioIdReceptor: receptorId,
            PublicacionId: publicacionId,
            UsuarioId: oferenteId,
        };

        await Oferta.create(oferta);

        // Actualizar la cantidad de ofertas recibidas en la publicación
        const publicacion = await Publicacion.findByPk(publicacionId);
        if (publicacion) {
            publicacion.cantidadOfertasRecibidas += 1;
            await publicacion.save();
        }
    } catch (error) {
        console.error({ error });
    }
};

module.exports = crearOferta;