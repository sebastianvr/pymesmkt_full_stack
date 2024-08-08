const { faker } = require('@faker-js/faker/locale/es');
const Pyme = require('../../models/pyme');
const getRegionAndCommune = require('./regions-and-communes');
const { uid } = require('uid');

async function crearPyme(usuarioId) {
    console.log('[seed] crearPyme()');
    try {
        const { region, comuna } = getRegionAndCommune();
        await Pyme.create({
            id: uid(15),
            nombrePyme: faker.company.name(),
            rut: faker.string.alphanumeric(11),
            rubro: faker.commerce.department(),
            tipoEmpresa: faker.helpers.arrayElement(['SERVICIO', 'PRODUCTO']),
            regionEmpresa: region,
            comunaEmpresa: comuna,
            dirEmpresa: faker.location.streetAddress(),
            descripcionEmpresa: faker.lorem.sentence(),
            estado: true,
            UsuarioId: usuarioId,
        });
    } catch (error) {
        console.error({ error });
    }
};

module.exports = crearPyme;