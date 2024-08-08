const { uid } = require('uid');
const Publicacion = require('../../models/publicacion');
const { faker } = require('@faker-js/faker/locale/es');

async function crearPublicacion(usuarioId) {
    console.log('[seed] crearPublicacion()');
    try {
        const warranty = faker.datatype.boolean();

        await Publicacion.create({
            id: uid(15),
            titulo: faker.lorem.paragraph(1),
            descripcion: faker.lorem.paragraph(8, 10),
            productoOServicio: faker.helpers.arrayElement(['PRODUCTO', 'SERVICIO']),
            cantidadElementos: faker.number.int({ max: 100 }),
            precioUnidad: faker.commerce.price({ min: 50, max: 200 }),
            precioTotal: faker.commerce.price({ min: 1130, max: 203001 }),
            modelo: faker.string.alphanumeric(7),
            color: faker.color.human(),
            fechaInicioServicio: faker.date.future(),
            fechaFinServicio: faker.date.future(),
            garantia: warranty,
            aniosGarantia: warranty ? faker.number.int({ min: 0, max: 5 }) : undefined,
            archivoAdjunto: null,
            procesoDePublicacion: 'INICIADA',
            cantidadOfertasRecibidas: 0,
            estado: true,
            UsuarioId: usuarioId,
        });
    } catch (error) {
        console.error({ error });
    }
};

module.exports = crearPublicacion;