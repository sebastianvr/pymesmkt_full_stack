const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Colaboracion = db.define(
    'Colaboracion',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        pymeVenderora: {
            type: DataTypes.STRING
        },
        pymeCompradora: {
            type: DataTypes.STRING
        },
        cantidadDeCompras: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        indexes: [{ unique: true, fields: ['id'] }]
    })

module.exports = Colaboracion;
