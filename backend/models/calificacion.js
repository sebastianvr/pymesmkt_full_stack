const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Calificacion = db.define(
    'Calificacion',
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull : false
        },
        puntaje: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull : false
        },
        reseña: {
            type: DataTypes.TEXT,
            allowNull : false
        },
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
    }
);



module.exports = Calificacion;
