const { DataTypes } = require('sequelize');
const db = require('../db/connection');



const DeleteUsuario = db.define(
    'DeletedUsuario',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        nombreUsuario: {
            type: DataTypes.STRING
        },
        apellidos: {
            type: DataTypes.STRING
        },
        emailUsuario: {
            type: DataTypes.STRING,
            unique: true
        },
        run: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        comuna: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
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

module.exports = DeleteUsuario;