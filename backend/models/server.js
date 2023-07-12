const express = require('express')
const cors = require('cors');

const db = require('../db/connection');
const { storage } = require('../minio/connection');
require('./asociaciones');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.API_PORT || 8081;

        // endpoints
        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuario',
            pyme: '/api/pyme',
            signIn: '/api/sign-in',
            publicacion: '/api/publicacion',
            colaboracion: '/api/colaboracion',
            oferta: '/api/oferta',
            reclamo: '/api/reclamo',
            pago: '/api/pago',
            compra: '/api/compra',
            calificacion: '/api/calificacion',
            seed: '/api/seed'
        }

        this.dbConnection();
        this.minioConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            // force: true ; DROP ALL TABLES
            await db.sync({ force: false });
            console.log('Mysql connected');
        } catch (error) {
            throw new Error(error);
        }
    }

    async minioConnection() {
        try {
            this.minioClient = storage
            console.log('MinIO connected');
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares() {
        //Cors
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.usuario, require('../routes/usuario.routes'))
        this.app.use(this.paths.pyme, require('../routes/pyme.routes'))
        this.app.use(this.paths.auth, require('../routes/auth.routes'))
        this.app.use(this.paths.signIn, require('../routes/sign-in.routes'))
        this.app.use(this.paths.publicacion, require('../routes/publicacion.routes'))
        this.app.use(this.paths.colaboracion, require('../routes/colaboracion.routes'))
        this.app.use(this.paths.oferta, require('../routes/oferta.routes'))
        this.app.use(this.paths.reclamo, require('../routes/reclamo.routes'))
        this.app.use(this.paths.pago, require('../routes/webpay-plus-mall.routes'))
        this.app.use(this.paths.compra, require('../routes/compra.routes'))
        this.app.use(this.paths.calificacion, require('../routes/calificacion.routes'))
        this.app.use(this.paths.seed, require('../routes/seed.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`API Ejecutando, puerto: ${this.port}`)
        })
    }
}

module.exports = Server;