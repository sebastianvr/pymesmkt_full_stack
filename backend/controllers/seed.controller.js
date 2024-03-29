const { response, request } = require('express');
const { faker } = require('@faker-js/faker/locale/es');
const bcryptjs = require('bcryptjs');
const { uid } = require('uid');

const Usuario = require('../models/usuario');
const Publicacion = require('../models/publicacion');
const Pyme = require('../models/pyme');


const crearUsuario = async (req = request, res = response) => {
  console.log('[seed] crearUsuario()');
  const nroUsuarios = 10;
  const publicaciones = 10;
  const credencialesUsuarios = [];

  try {
    for (let index = 0; index < nroUsuarios; index++) {
      const contrasenia = faker.internet.password();
      const salt = bcryptjs.genSaltSync();
      const password = bcryptjs.hashSync(contrasenia, salt);

      const { region, comuna } = getRegionAndCommune();

      const usuario = await Usuario.create({
        id: uid(15),
        nombreUsuario: faker.person.firstName(),
        apellidos: faker.person.lastName(),
        emailUsuario: faker.internet.email().toLowerCase(),
        imagen: null,
        estado: true,
        run: faker.string.alphanumeric(9),
        contrasenia: password,
        // comuna: faker.location.city(),
        // region: faker.location.state(),
        comuna,
        region,
        dir1Propietario: faker.location.streetAddress(),
        dir2Propietario: faker.location.secondaryAddress(),
        descripcion: faker.lorem.sentence(),
        rol: faker.helpers.arrayElement(['CLIENT-USER']),
      });

      credencialesUsuarios.push({ correo: usuario.emailUsuario, contrasenia });
      await crearPyme(usuario.id);

      for (let index = 0; index < publicaciones; index++) {
        await (crearPublicacion(usuario.id));
      }
    }

    res.status(200).json({
      ok: true,
      msg: 'Usuarios creados con éxito',
      credencialesUsuarios,
    });

  } catch (error) {
    console.error({ error });
    res.status(500).json({
      ok: false,
      error: error,
    });
  }
};

const crearPyme = async (usuarioId) => {
  console.log('[seed] crearPyme()');
  try {

    const { region, comuna } = getRegionAndCommune();
    await Pyme.create({
      id: uid(15),
      nombrePyme: faker.company.name(),
      rut: faker.string.alphanumeric(11),
      rubro: faker.commerce.department(),
      tipoEmpresa: faker.helpers.arrayElement(['SERVICIO', 'PRODUCTO']),
      // regionEmpresa: faker.location.state(),
      // comunaEmpresa: faker.location.city(),
      regionEmpresa: region,
      comunaEmpresa: comuna,
      dirEmpresa: faker.location.streetAddress(),
      descripcionEmpresa: faker.lorem.sentence(),
      estado: true,
      UsuarioId: usuarioId,
    });
  } catch (error) {
    console.error({ error });
  };
};

const crearPublicacion = async (usuarioId) => {
  console.log('[seed] crearPublicacion()');
  try {

    const warranty = faker.datatype.boolean();

    await Publicacion.create({
      id: uid(15),
      titulo: faker.lorem.words(),
      descripcion: faker.lorem.paragraph(),
      productoOServicio: faker.helpers.arrayElement(['PRODUCTO', 'SERVICIO']),
      cantidadElementos: faker.number.int({ max: 100 }),
      precioUnidad: faker.commerce.price({ min: 50, max: 200 }),
      precioTotal: faker.commerce.price({ min: 1130, max: 203001 }),
      modelo: faker.string.alphanumeric(7),
      color: faker.color.human(),
      fechaInicioServicio: faker.date.future(),
      fechaFinServicio: faker.date.future(),
      // horasATrabajar: faker.random.number({ min: 1, max: 8 }).toString(),
      garantia: warranty,
      aniosGarantia: warranty ? faker.number.int({ min: 0, max: 5 }) : undefined,
      archivoAdjunto: null,
      procesoDePublicacion: faker.helpers.arrayElement(['INICIADA']),
      cantidadOfertasRecibidas: faker.number.int({ min: 0, max: 10 }),
      estado: true,
      UsuarioId: usuarioId,
    });
  } catch (error) {
    console.error({ error });
  };
};

const allCommunesAndRegions = [
  {
    "region": "Arica y Parinacota",
    "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
  },
  {
    "region": "Tarapacá",
    "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
  },
  {
    "region": "Antofagasta",
    "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
  },
  {
    "region": "Atacama",
    "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
  },
  {
    "region": "Coquimbo",
    "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
  },
  {
    "region": "Valparaíso",
    "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
  },
  {
    "region": "Región del Libertador Gral. Bernardo O’Higgins",
    "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
  },
  {
    "region": "Región del Maule",
    "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
  },
  {
    "region": "Región de Ñuble",
    "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
  },
  {
    "region": "Región del Biobío",
    "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
  },
  {
    "region": "Región de la Araucanía",
    "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
  },
  {
    "region": "Región de Los Ríos",
    "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
  },
  {
    "region": "Región de Los Lagos",
    "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
  },
  {
    "region": "Región Aisén del Gral. Carlos Ibáñez del Campo",
    "comunas": ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
  },
  {
    "region": "Región de Magallanes y de la Antártica Chilena",
    "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  },
  {
    "region": "Región Metropolitana de Santiago",
    "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
  }

];

function getRegionAndCommune() {
  const regionIndex = Math.floor(Math.random() * allCommunesAndRegions.length);
  const regionSelected = allCommunesAndRegions[regionIndex];

  const communeIndex = Math.floor(Math.random() * regionSelected.comunas.length);
  const communeSelected = regionSelected.comunas[communeIndex];

  return { region: regionSelected.region, comuna: communeSelected };
}

module.exports = {
  crearUsuario,
};