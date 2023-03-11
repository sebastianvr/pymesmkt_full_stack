const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Compra = db.define(
    'Compra',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        precio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        codAutorizacion: {
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
    }
);



module.exports = Compra;
