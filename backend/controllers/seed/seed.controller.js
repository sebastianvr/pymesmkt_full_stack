const { response, request } = require('express');
const { Op, Sequelize } = require('sequelize');

const Usuario = require('../../models/usuario');
const Publicacion = require('../../models/publicacion');
const Oferta = require('../../models/oferta');

const crearPublicacion = require('./create-publication');
const crearUsuario = require('./create-user');
const crearPyme = require('./create-pyme');
const crearOferta = require('./create-offer');
const comprarOferta = require('./create-purchase');
const crearAdmin = require('./create-admin.js');

const createMockDataBase = async (req = request, res = response) => {
  console.log('[seed] initSeed()');
  const nroUsuarios = 10;
  const nroPublications = 20;
  const nroOfertas = 6;
  const nroCompras = 3;

  try {
    const credencialesUsuarios = {
      admins: [],
      clients: []
    };

    for (let index = 0; index < nroUsuarios; index++) {
      const { usuario, contrasenia } = await crearUsuario();
      credencialesUsuarios.clients.push({
        email: usuario.emailUsuario,
        contrasenia
      });

      await crearPyme(usuario.id);

      for (let index = 0; index < nroPublications; index++) {
        await crearPublicacion(usuario.id);
      }
    }

    // Crear admins
    const { usuario: adminUsuario, contrasenia: adminContrasenia } = await crearAdmin();
    credencialesUsuarios.admins.push({
      email: adminUsuario.emailUsuario,
      contrasenia: adminContrasenia
    });

    // Obtener todos los usuarios creados
    const usuarios = await Usuario.findAll({
      where: { rol: 'CLIENT-USER' }
    });

    // Hacer ofertas para todos los usuarios
    await hacerOfertas(nroOfertas, usuarios);

    // Realizar compras
    await hacerCompras(nroCompras, usuarios);

    return res.status(200).json({
      ok: true,
      msg: 'Usuarios creados con éxito',
      credencialesUsuarios,
    });

  } catch (error) {
    console.error({ error });
    return res.status(500).json({
      ok: false,
      error: error,
    });
  }
};

const hacerCompras = async (nroCompras, usuarios) => {
  for (const usuario of usuarios) {
    const ofertasUsuario = await Oferta.findAll({
      where: {
        usuarioIdReceptor: usuario.id,
        estado: true, // Asumiendo que 'activa' es el estado de oferta disponible
        procesoDeOferta: 'DISPONIBLE' // Asumiendo que 'activa' es el estado de oferta disponible
      }
    });

    if (ofertasUsuario.length === 0) {
      // console.log(`El usuario ${usuario.id} no tiene ofertas activas.`);
      continue;
    } else {
      // Seleccionar y comprar hasta `nroCompras` diferentes ofertas
      const publicacionesCompradas = new Set();
      let comprasRealizadas = 0;

      for (const oferta of ofertasUsuario) {
        if (comprasRealizadas >= nroCompras) break;

        if (!publicacionesCompradas.has(oferta.PublicacionId)) {
          await comprarOferta(usuario.id, oferta);
          publicacionesCompradas.add(oferta.PublicacionId);
          comprasRealizadas++;
        }
      }
    }
  }
}

const hacerOfertas = async (nroOfertas, usuarios) => {
  try {
    for (const usuario of usuarios) {
      const publicacionesRnd = await Publicacion.findAll({
        where: {
          UsuarioId: { [Op.ne]: usuario.id } // Excluir las publicaciones del usuario actual
        },
        order: Sequelize.literal('RAND()'), // Ordenar aleatoriamente
        limit: nroOfertas
      });

      for (const publicacion of publicacionesRnd) {
        await crearOferta(publicacion.id, usuario.id, publicacion.UsuarioId);
      }
    }
  } catch (error) {
    console.error('Error al hacer ofertas:', error);
    throw error; // Propagar el error para manejarlo en la función llamadora si es necesario
  }
};


module.exports = {
  createMockDataBase,
};
