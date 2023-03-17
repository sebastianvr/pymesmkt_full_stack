const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Pyme = db.define(
    'Pyme',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        nombrePyme: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rut: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        rubro: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipoEmpresa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        regionEmpresa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comunaEmpresa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dirEmpresa: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcionEmpresa: {
            type: DataTypes.STRING
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

module.exports = Pyme;
