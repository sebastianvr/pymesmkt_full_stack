const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Oferta = db.define(
    'Oferta',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        mensaje: {
            type: DataTypes.TEXT
        },
        precioOferta: {
            type: DataTypes.INTEGER,
        },
        // ESTADOS DE OFERTA
        // DISPONIBLE: oferta que no ha sido rechazada ni pagada.
        // FINALIZADA: oferta pagada.
        procesoDeOferta: {
            type: DataTypes.ENUM('FINALIZADA', 'DISPONIBLE', 'RECHAZADA'),
            defaultValue: 'DISPONIBLE' 
        },
        // Eliminacion, SOLO MODIFICO A FALSO, AUN EXISTE!
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
    },
    {
        indexes: [{ unique: true, fields: ['id'] }]
    });

module.exports = Oferta;
