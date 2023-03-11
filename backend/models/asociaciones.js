const Calificacion = require('./calificacion');
const Colaboracion = require('./colaboracion');
const Compra = require('./compra');
const Oferta = require('./oferta');
const Publicacion = require('./publicacion')
const Pyme = require('./pyme');
const Reclamo = require('./reclamo');
const Usuario = require('./usuario')

// NOTA IMPORTANTE! 
// Las asociaciones Sequelize se definen por pares

//Un usuario tiene una pyme
//Una pyme pertenece a un usuario 
Usuario.hasOne(Pyme);
Pyme.belongsTo(Usuario);


// UNA PUBLICACION RECIBE MUCHAS OFERTAS
//Una publicacion tiene muchas ofertas
//Una oferta pertenece a una publicacion 
Publicacion.hasMany(Oferta);
Oferta.belongsTo(Publicacion);

// UN USUARIO CREA OFERTAS
//Un usuario tiene muchas ofertas
//Una oferta pertenece a un usuario 
Usuario.hasMany(Oferta);
Oferta.belongsTo(Usuario);


Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario)

// Un usuario RECIBE!!!  muchos reclamos
Usuario.hasMany(Reclamo);
Reclamo.belongsTo(Usuario);


Publicacion.hasMany(Reclamo);
Reclamo.belongsTo(Publicacion)
    

// UN USUARIO HACE MUCHAS COMPRAS
Usuario.hasMany(Compra);
Compra.belongsTo(Usuario);

// UNA PUBLICACION RECIBE UNA COMPRA
Publicacion.hasOne(Compra);
Compra.belongsTo(Publicacion);

// UNA OFERTA RECIBE UNA COMPRA
// compra se lleva como fk el id de oferta
Oferta.hasOne(Compra);
Compra.belongsTo(Oferta);

//Un usuario tiene muchas calificaciones
//Una calificacion pertenece a un usuario  
Usuario.hasMany(Calificacion);
Calificacion.belongsTo(Usuario);

// TOD0 : MOSTAR BOTONES DE RELAIZAR CALIFICACIONES Y REALIZAR RECLAMOS, PONER REALIZAR LOGICA PARA QUITARLOS EN CASO DE ESTAR REALIZADOS
//YA QUE SOLO PODEMOS HACER UN RECLAMO POR PUBLICACION Y UNA CALIFICAACION POR CADA COMPRA 
Calificacion.hasOne(Compra);
Compra.belongsTo(Calificacion)