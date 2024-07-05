const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Reclamo = db.define(
    'Reclamo',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        documentos: {
            type: DataTypes.TEXT,
        },
        mensajeAdmin: {
            type: DataTypes.TEXT,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
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

module.exports = Reclamo;