

const { response, request } = require('express');
const { faker } = require('@faker-js/faker/locale/es');
const bcryptjs = require('bcryptjs');
const { uid } = require('uid');

const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');


const crearUsuario = async (req = request, res = response) => {
  const nroUsuarios = 10;
  const publicaciones = 50;
  const credencialesUsuarios = [];

  try {
    for (let index = 0; index < nroUsuarios; index++) {
      const contrasenia = faker.internet.password();
      const salt = bcryptjs.genSaltSync();
      const password = bcryptjs.hashSync(contrasenia, salt);


      const usuario = await Usuario.create({
        id: uid(15),
        nombreUsuario: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        emailUsuario: faker.internet.email().toLowerCase(),
        imagen: null,
        estado: true,
        run: faker.string.alphanumeric(9),
        contrasenia: password,
        comuna: faker.location.city(),
        region: faker.location.state(),
        dir1Propietario: faker.location.streetAddress(),
        dir2Propietario: faker.location.secondaryAddress(),
        descripcion: faker.lorem.sentence(),
        rol: faker.helpers.arrayElement(['CLIENT-USER']),
      });

      credencialesUsuarios.push({ correo: usuario.emailUsuario, contrasenia })

      await crearPyme(usuario.id)

      for (let index = 0; index < publicaciones; index++) {
        await (crearPublicacion(usuario.id))
      }
    }

    res.status(200).json({
      ok: true,
      msg: 'Usuarios creados con éxito',
      credencialesUsuarios
    });

  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear el usuario',
      error: error,
    });
  }
};

const crearPyme = async (usuarioId) => {
  try {
    const pyme = await Pyme.create({
      id: uid(15),
      nombrePyme: faker.company.name(),
      rut: faker.string.alphanumeric(11),
      rubro: faker.commerce.department(),
      tipoEmpresa: faker.helpers.arrayElement(['SERVICIO', 'PRODUCTO']),
      regionEmpresa: faker.location.state(),
      comunaEmpresa: faker.location.city(),
      dirEmpresa: faker.location.streetAddress(),
      descripcionEmpresa: faker.lorem.sentence(),
      estado: true,
      UsuarioId: usuarioId,
    });

    console.log({ pyme });
  } catch (error) {
    console.error('Error al crear la Pyme:', { error });
  };
};

const crearPublicacion = async (usuarioId) => {
  try {
    const publicacion = await Publicacion.create({
      id: uid(15),
      titulo: faker.lorem.words(),
      descripcion: faker.lorem.paragraph(),
      productoOServicio: faker.helpers.arrayElement(['PRODUCTO', 'SERVICIO']),
      cantidadElementos: faker.number.int({ max: 100 }),
      precioUnidad: faker.commerce.price({ min: 50, max: 200 }),
      precioTotal: faker.commerce.price({ min: 1130, max: 203001 }),
      modelo: faker.string.alphanumeric(7),
      color: faker.color.human(),
      fechaInicioServicio: faker.date.future(),
      fechaFinServicio: faker.date.future(),
      // horasATrabajar: faker.random.number({ min: 1, max: 8 }).toString(),
      garantia: faker.datatype.boolean(),
      aniosGarantia: faker.number.int({ min: 0, max: 5 }),
      archivoAdjunto: null,
      procesoDePublicacion: faker.helpers.arrayElement(['INICIADA']),
      cantidadOfertasRecibidas: faker.number.int({ min: 0, max: 10 }),
      estado: true,
      UsuarioId: usuarioId,
    });

    // console.log({ publicacion });
  } catch (error) {
    console.error('Error al crear la publicación:', { error });
  };
};

module.exports = {
  crearUsuario,
};