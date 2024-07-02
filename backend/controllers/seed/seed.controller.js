const { response, request } = require('express');
const { Op, Sequelize } = require('sequelize');

const Usuario = require('../../models/usuario');
const Publicacion = require('../../models/publicacion');
const Oferta = require('../../models/oferta');
const Compra = require('../../models/compra.js');

const crearPublicacion = require('./create-publication');
const crearUsuario = require('./create-user');
const crearPyme = require('./create-pyme');
const crearOferta = require('./create-offer');
const comprarOferta = require('./create-purchase');
const crearAdmin = require('./create-admin.js');
const crearReclamo = require('./create-claim.js');

/**
 * Crea una base de datos ficticia con usuarios, publicaciones, ofertas, compras y reclamos.
 * 
 * @param {Object} req.body - El cuerpo de la solicitud.
 * @param {number} req.body.nroUsuarios - Número de usuarios a crear. Por defecto, 40.
 * @param {number} req.body.nroPublications - Número de publicaciones por usuario. Por defecto, 10.
 * @param {number} req.body.nroOfertas - Número de ofertas por usuario. Por defecto, 10.
 * @param {number} req.body.nroCompras - Número de compras por usuario. Por defecto, 5.
 * @param {number} req.body.nroReclamos - Número de reclamos por usuario. Por defecto, 2.
 * @param {number} req.body.nroAdmins - Número de administradores a crear. Por defecto, 0.
 * 
 * @returns {Promise<response>} La respuesta de la solicitud con el estado de la operación.
 * 
 * @description
 * Este método crea una base de datos ficticia con la cantidad especificada de usuarios, publicaciones, ofertas, compras y reclamos.
 * Si no se proporcionan los parámetros en el cuerpo de la solicitud, se utilizan valores por defecto.
 * 
 * Para la creación de ofertas, compras y reclamos, existe una probabilidad del 50% (0.5) de que cada usuario realice estas acciones.
 */
const createMockDataBase = async (req = request, res = response) => {
  console.log('[seed] initSeed()');

  const {
    nroUsuarios = 40,
    nroPublications = 10,
    nroOfertas = 10,
    nroCompras = 5,
    nroReclamos = 2,
    nroAdmins = 0,
  } = req.body;

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
    for (let index = 0; index < nroAdmins; index++) {
      const { usuario: adminUsuario, contrasenia: adminContrasenia } = await crearAdmin();
      credencialesUsuarios.admins.push({
        email: adminUsuario.emailUsuario,
        contrasenia: adminContrasenia
      });
    }

    // Obtener todos los usuarios creados
    const usuarios = await Usuario.findAll({
      where: { rol: 'CLIENT-USER' }
    });

    // Hacer ofertas para todos los usuarios si se proporciona nroOfertas
    if (nroOfertas > 0) {
      await hacerOfertas(nroOfertas, usuarios);
    }

    // Realizar compras si se proporciona nroCompras y hay ofertas
    if (nroCompras > 0 && nroOfertas > 0) {
      await hacerCompras(nroCompras, usuarios);
    }

    // Crear reclamos si se proporciona nroReclamos y hay compras
    if (nroReclamos > 0 && nroCompras > 0) {
      await hacerReclamos(nroReclamos, usuarios);
    }

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
  for (const users of usuarios) {
    // the user wants to make a buy ?
    const wantMakeBuy = Math.random() < 0.5; // 50% de probabilidad de querer hacer una compra

    if (!wantMakeBuy) {
      continue;
    }

    const ofertasUsuario = await Oferta.findAll({
      where: {
        usuarioIdReceptor: users.id,
        estado: true,
        procesoDeOferta: 'DISPONIBLE'
      }
    });

    if (ofertasUsuario.length === 0) {
      continue;
    } else {
      // Seleccionar y comprar hasta `nroCompras` diferentes ofertas
      const publicacionesCompradas = new Set();
      let comprasRealizadas = 0;

      for (const oferta of ofertasUsuario) {
        if (comprasRealizadas >= nroCompras) break;

        if (!publicacionesCompradas.has(oferta.PublicacionId)) {
          await comprarOferta(users.id, oferta);
          publicacionesCompradas.add(oferta.PublicacionId);
          comprasRealizadas++;
        }
      }
    }
  }
}

const hacerOfertas = async (nroOfertas, usuarios) => {
  try {
    for (const user of usuarios) {
      // the user wants to make a offer ?
      const wantMakeOffer = Math.random() < 0.5; // 50% de probabilidad de querer hacer una oferta
      if (!wantMakeOffer) continue;

      const publicacionesRnd = await Publicacion.findAll({
        where: {
          UsuarioId: { [Op.ne]: user.id } // Excluir las publicaciones del usuario actual
        },
        order: Sequelize.literal('RAND()'), // Ordenar aleatoriamente
        limit: nroOfertas
      });

      for (const publicacion of publicacionesRnd) {
        await crearOferta(publicacion.id, user.id, publicacion.UsuarioId);
      }
    }
  } catch (error) {
    console.error('Error al hacer ofertas:', error);
    throw error;
  }
};

const hacerReclamos = async (nroReclamos, usuarios) => {
  for (const usuario of usuarios) {
    const wantMakeClaim = Math.random() < 0.5; // 50% de probabilidad de querer hacer un reclamo
    if (!wantMakeClaim) continue;

    const comprasUsuario = await Compra.findAll({
      where: { UsuarioId: usuario.id },
      include: [
        {
          model: Oferta,
          required: true,
        },
        {
          model: Publicacion,
          required: true,
        }
      ],
    });

    if (comprasUsuario.length > 0) {
      let reclamosRealizados = 0;

      while (reclamosRealizados < nroReclamos) {
        const compraSeleccionada = comprasUsuario[
          Math.floor(Math.random() * comprasUsuario.length)
        ];

        if (!compraSeleccionada || !compraSeleccionada.Ofertum) continue;

        await crearReclamo(
          compraSeleccionada.Ofertum.UsuarioId, // ID del usuario quien recibira el reclamo
          compraSeleccionada.id, // ID de la compra asociada al reclamo
          compraSeleccionada.PublicacionId // ID publicacion comprada
        );

        reclamosRealizados++;
      }
    }
  }

};

module.exports = {
  createMockDataBase,
};
