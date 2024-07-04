const Compra = require("../../models/compra");
const Oferta = require("../../models/oferta");
const Publicacion = require("../../models/publicacion");
const Reclamo = require("../../models/reclamo");
const Usuario = require("../../models/usuario");

async function dropDatabase() {
    try {
        // Eliminar todas las compras
        await Compra.destroy({
            where: {}
        });

        // Eliminar todas las ofertas
        await Oferta.destroy({
            where: {}
        });

        // Eliminar todas las publicaciones
        await Publicacion.destroy({
            where: {}
        });

        // Eliminar todas las reclamaciones
        await Reclamo.destroy({
            where: {}
        });

        // Eliminar todos los usuarios
        await Usuario.destroy({
            where: { rol: 'CLIENT-USER' }
        });

    } catch (error) {
        console.error('Error al eliminar datos:', error);
        throw error;
    }
};

module.exports = dropDatabase;
