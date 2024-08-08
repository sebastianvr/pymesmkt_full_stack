const { Sequelize } = require('sequelize');

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: 'db',
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: console.log,
        timezone: '-03:00', // Configuración de la zona horaria de Chile
    }
);

module.exports = db;
