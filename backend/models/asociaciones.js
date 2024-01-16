const Calificacion = require('./calificacion');
const Colaboracion = require('./colaboracion');
const Compra = require('./compra');
const Oferta = require('./oferta');
const Publicacion = require('./publicacion')
const Pyme = require('./pyme');
const Reclamo = require('./reclamo');
const Usuario = require('./usuario')

/**
 * NOTA IMPORTANTE
 * !Las asociaciones en Sequelize se definen por PARES! 
 */

/* Un usuario TIENE una pyme */
Usuario.hasOne(Pyme);
Pyme.belongsTo(Usuario);

/* Una publicacion RECIBE muchas ofertas */
Publicacion.hasMany(Oferta);
Oferta.belongsTo(Publicacion);

/* Un usuario CREA muchas ofertas */
Usuario.hasMany(Oferta);
Oferta.belongsTo(Usuario);

/* Un usuario CREA muchas publicaciones */
Usuario.hasMany(Publicacion);
Publicacion.belongsTo(Usuario);

/* Un usuario RECIBE muchos reclamos */
Usuario.hasMany(Reclamo);
Reclamo.belongsTo(Usuario);

Publicacion.hasMany(Reclamo);
Reclamo.belongsTo(Publicacion)

/* Un usuario CREA muchas compras */
Usuario.hasMany(Compra);
Compra.belongsTo(Usuario);

/* Una publicacion RECIBE una compra */
Publicacion.hasOne(Compra);
Compra.belongsTo(Publicacion);

/**
 * Una oferta RECIBE una compra
 * Compra se lleva como fk el id de Oferta
 * */
Oferta.hasOne(Compra);
Compra.belongsTo(Oferta);

/* Un usuario RECIBE muchas calificaciones */
Usuario.hasMany(Calificacion);
Calificacion.belongsTo(Usuario);

/**
 * Todo: mostar botones de realizar calificaciones y realizar reclamos, 
 * realizar logica para quitarlos en caso de estar realizados
 * ya que solo podemos hacer un reclamo por publicacion y una calificaacion por cada compra 
 * */
Calificacion.hasOne(Compra);
Compra.belongsTo(Calificacion)