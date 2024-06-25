const { faker } = require('@faker-js/faker/locale/es');
const bcryptjs = require('bcryptjs');
const { uid } = require('uid');

const Usuario = require("../../models/usuario");
const getRegionAndCommune = require("./regions-and-communes");

async function crearUsuario() {
    const contrasenia = faker.internet.password();
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(contrasenia, salt);

    const { region, comuna } = getRegionAndCommune();

    const usuario = await Usuario.create({
        id: uid(15),
        nombreUsuario: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        emailUsuario: faker.internet.email().toLowerCase(),
        imagen: null,
        estado: true,
        run: faker.string.alphanumeric(9),
        contrasenia: password,
        comuna,
        region,
        dir1Propietario: faker.location.streetAddress(),
        dir2Propietario: faker.location.secondaryAddress(),
        descripcion: faker.lorem.sentence(),
        rol: 'CLIENT-USER',
    });

    return { usuario, contrasenia };
}

module.exports = crearUsuario;
