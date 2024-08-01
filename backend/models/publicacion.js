const { DataTypes } = require('sequelize');
const db = require('../db/connection');


const Publicacion = db.define('Publicacion', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    productoOServicio: {
        type: DataTypes.ENUM('PRODUCTO', 'SERVICIO'),
        allowNull: false
    },
    cantidadElementos: {
        type: DataTypes.INTEGER
    },
    precioUnidad: {
        type: DataTypes.INTEGER
    },
    precioTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING
    },
    fechaInicioServicio: {
        type: DataTypes.DATE,
    },
    fechaFinServicio: {
        type: DataTypes.DATE,
    },
    horasATrabajar: {
        type: DataTypes.STRING,
    },
    garantia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    aniosGarantia: {
        type: DataTypes.INTEGER
    },
    archivoAdjunto: {
        type: DataTypes.STRING
    },

    // ESTADOS DE COMPRA
    // INICIADA: Pulicacion recien creada, puede recibir ofertas
    // FINALIZADA: Pulicacion pagada, no puede recibir ofertas
    procesoDePublicacion: {
        type: DataTypes.ENUM('FINALIZADA', 'EN PROCESO', 'INICIADA'),
        defaultValue: 'INICIADA'
    },
    cantidadOfertasRecibidas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // Si existe o no. 
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

module.exports = Publicacion;
