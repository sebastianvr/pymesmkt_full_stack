const { faker } = require('@faker-js/faker/locale/es');
const { uid } = require('uid');
const Reclamo = require('../../models/reclamo');

const crearReclamo = async (usuarioId, compraId, publicacionId) => {
    try {
        await Reclamo.create({
            id: uid(15),
            titulo: faker.lorem.paragraph(),
            mensaje: faker.lorem.paragraph(9, 11),
            documentos: faker.internet.url(),
            estado: true,
            UsuarioId: usuarioId,
            CompraId: compraId,
            PublicacionId: publicacionId,
        });
    } catch (error) {
        console.error(`Error al crear el reclamo para el usuario ${usuarioId}:`, error);
    }
};

module.exports = crearReclamo;
