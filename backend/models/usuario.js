const { DataTypes } = require('sequelize');
const db = require('../db/connection');



const Usuario = db.define(
    'Usuario',
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
        imagen: {
            type: DataTypes.BLOB
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        run: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        contrasenia: {
            type: DataTypes.STRING,
            allowNull: false
        },
        comuna: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        },
        dir1Propietario: {
            type: DataTypes.STRING
        },
        dir2Propietario: {
            type: DataTypes.STRING
        },
        descripcion: {
            type: DataTypes.STRING
        },
        rol: {
            type: DataTypes.ENUM('CLIENT-USER', 'ADMIN-USER')
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

module.exports = Usuario;