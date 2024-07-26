const { response, request } = require('express');
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const db = require('../db/connection');
const { minioClient } = require('../s3/connection');
const { uid } = require('uid');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');
const DeleteUsuario = require('../models/deletedUsuario');
const { getProfileUserImage } = require('./s3.controller');


const usuariosGetAll = async (req = request, res = response) => {
    console.log('[usuarios] usuariosGetAll()')

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const baseFilter = {
        estado: true,
        rol: 'CLIENT-USER',
    };

    const additionalFilters = {};

    if (req.query.nombre) {
        additionalFilters.nombreUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.nombre.toLowerCase()}%`,
                },
            ],
        };
    };

    if (req.query.email) {
        additionalFilters.emailUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('emailUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.email.toLowerCase()}%`,
                },
            ],
        };
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters
    };
    // console.log({ filter });

    try {
        const { count, rows: usuarios } =
            await Usuario.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: Pyme,
                        where: { estado: true },
                    },
                ]
            });

        if (!usuarios.length) {
            if (Object.keys(additionalFilters).length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    usuarios: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron usuarios.',
                    usuarios: [],
                });
            }
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuariosGetAll().',
            error
        });
    }
}

const usuariosGetAllSuspended = async (req = request, res = response) => {
    console.log('[usuarios] usuariosGetAllSuspended()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const baseFilter = {
        estado: false,
        rol: 'CLIENT-USER',
    };

    const additionalFilters = {};
    if (req.query.nombre) {
        additionalFilters.nombreUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.nombre.toLowerCase()}%`,
                },
            ],
        };
    };

    if (req.query.email) {
        additionalFilters.emailUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('emailUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.email.toLowerCase()}%`,
                },
            ],
        };
    }

    const filter = {
        ...baseFilter,
        ...additionalFilters
    };
    // console.log({ filter });

    try {
        const { count, rows: usuarios } =
            await Usuario.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
                include: [
                    {
                        model: Pyme,
                        where: { estado: true },
                    },
                ]
            });

        if (!usuarios.length) {
            if (Object.keys(additionalFilters).length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    usuarios: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron usuarios.',
                    usuarios: [],
                });
            }
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuariosGetAllSuspended()',
            error,
        });
    }
}

const usuariosGetAllDeleted = async (req = request, res = response) => {
    console.log('[usuarios] usuariosGetAllDeleted()');
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const filter = {};
    if (req.query.nombre) {
        filter.nombreUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.nombre.toLowerCase()}%`,
                },
            ],
        };
    };

    if (req.query.email) {
        filter.emailUsuario = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('emailUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.email.toLowerCase()}%`,
                },
            ],
        };
    }

    // console.log({ filter });
    try {
        const { count, rows: usuarios } =
            await DeleteUsuario.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

        if (!usuarios.length) {
            if (Object.keys(filter).length > 0) {
                return res.status(200).json({
                    message: 'No se encontraron coincidencias para los filtros aplicados.',
                    noSearchMatch: true,
                    usuarios: []
                });
            } else {
                return res.status(200).json({
                    message: 'No se encontraron usuarios.',
                    usuarios: [],
                });
            }
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuariosGetAllDeleted()',
            error,
        });
    }
}

const usuarioPost = async (req = request, res = response) => {
    console.log('[usuarios] usuarioPost()');

    //Id unico de 15 caracteres, para cada nuevo usuario creado
    const myId = uid(15);

    const {
        nombreUsuario,
        apellidos,
        run,
        emailUsuario,
        contrasenia,
        comuna,
        region,
        dir1Propietario,
        dir2Propietario,
        descripcion,
    } = req.body


    //encryptar contraseña
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(contrasenia, salt);

    const nuevoUsuario = {
        id: myId,
        nombreUsuario,
        apellidos,
        emailUsuario,
        run,
        contrasenia: password,
        comuna,
        region,
        dir1Propietario,
        dir2Propietario,
        descripcion,
        rol: 'CLIENT-USER',
    }

    try {
        await Usuario.create(nuevoUsuario, {
            // include: [Pyme]
        });

        return res.status(200).json({
            msg: 'nuevo usuario creado'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioPost()',
            error,
        });
    }

}

const usuarioGet = async (req = request, res = response) => {
    console.log('[usuarios] usuarioGet()');

    const { id } = req.params;
    const transaction = await db.transaction();
    
    try {
        const usuario = await Usuario.findByPk(id, {
            where: { estado: true },
            include: [
                {
                    model: Pyme,
                    where: { estado: true },
                },
            ],
            transaction
        });

        if (!usuario) {
            await transaction.rollback();
            return res.status(400).json({
                msg: `No existe usuario con id: ${id}`
            });
        }

        if (usuario.imagen) {
            const url = await getProfileUserImage(usuario.imagen);
            usuario.imagen = url;
        }
        
        // console.log({usuario});
        await transaction.commit();
        return res.status(200).json(usuario);

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioGet()',
            error,
        });
    }
};

const usuarioPut = async (req = request, res = response) => {
    console.log('[usuarios] usuarioPut()');

    const { id } = req.params;
    const userData = req.body;

    try {
        // Inicia una transacción
        const transaction = await db.transaction();

        // Busca el usuario por su ID
        const usuario = await Usuario.findByPk(id, {
            include: [
                {
                    model: Pyme,
                    where: { estado: true },
                },
            ],
            transaction,
        });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Mapea la información del usuario según el modelo
        const userMapped = filterExistingFields({
            nombreUsuario: userData.nombre,
            apellidos: userData.apellidos,
            run: userData.run,
            emailUsuario: userData.email,
            imagen: userData.imagen,
            region: userData.opRegion,
            comuna: userData.opCommune,
            dir1Propietario: userData.direccionPropietario,
            dir2Propietario: userData.direccionPropietario2,
            descripcion: userData.descripcion,
        });

        // Mapea la información de la empresa (Pyme) según el modelo
        const pymeMapped = filterExistingFields({
            nombrePyme: userData.nombreEmpresa,
            rut: userData.rut,
            tipoEmpresa: userData.tipoEmpresa,
            rubro: userData.rubro,
            regionEmpresa: userData.regionEmpresa,
            comunaEmpresa: userData.communeEmpresa,
            dirEmpresa: userData.direccionEmpresa,
            descripcionEmpresa: userData.descripcionEmpresa,
        });
        // console.log({ userMapped });

        // Actualiza los campos del usuario con la información proporcionada 
        const userUdated =  await usuario.update(userMapped, { transaction });
        
        // Si existe información de la empresa (Pyme) en la solicitud, y hay campos en pymeMapped, 
        // actualiza también esa información
        if (usuario.Pyme && Object.keys(pymeMapped).length > 0) {
            await usuario.Pyme.update(pymeMapped, { transaction });
        }

        // Confirma la transacción
        await transaction.commit();

        // Prefirmar imagen si viene
        if(userMapped.imagen){
            const urlPresigned = await getProfileUserImage(userData.imagen);
            userUdated.imagen = urlPresigned;
        }

        return res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario,
        });
    } catch (error) {
        console.error(error);
        // Si ocurre un error, revierte la transacción
        await transaction.rollback();
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioPut()',
            error,
        });
    }

}

function filterExistingFields(obj) {
    return Object.keys(obj)
        .filter(key => obj[key] !== undefined && obj[key] !== null)
        .reduce((filteredObj, key) => {
            filteredObj[key] = obj[key];
            return filteredObj;
        }, {});
}

const usuarioDelete = async (req = request, res = response) => {
    console.log('[usuarios] usuarioDelete()');

    const { id } = req.params

    try {
        // buscar usuario
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario en bd'
            })
        }

        // Eliminar usuario
        const usuarioEliminado = await Usuario.destroy({
            where: { id }
        })

        // console.log('usuarioEliminado', usuarioEliminado)
        // copiar datos en una tabla usuariosEliminados
        const myId = uid(10);

        const deleteUsuario = {
            id: myId,
            nombreUsuario: usuario.nombreUsuario,
            apellidos: usuario.apellidos,
            emailUsuario: usuario.emailUsuario,
            run: usuario.run,
            comuna: usuario.comuna,
            region: usuario.region,
        };

        try {
            await DeleteUsuario.create(deleteUsuario);
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                ok: false,
                msg: 'Error al añadir usuario a lista de eliminados'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado de la bd'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioDelete()',
            error,
        });
    }
}

const suspendUser = async (req = request, res = response) => {
    console.log('[usuarios] suspendUser()');

    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario en bd',
            });
        }

        const usuarioSuspendido = await Usuario.update(
            { estado: false },
            { where: { id } },
        );

        return res.status(200).json({
            ok: true,
            msg: 'Usuario suspendido de la bd',
            usuario: usuarioSuspendido,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, suspendUser()',
            error,
        });
    }
}

const usuarioSuspended = async (req = request, res = response) => {
    console.log('[usuarios] usuarioSuspended()');

    const { id } = req.params;
    try {
        const busqueda = await Usuario.findByPk(id);

        if (!busqueda) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario en bd',
            });
        }

        const usuario = await Usuario.update(
            { estado: 0 },
            { where: { id } },
        );

        // console.log('usuario', usuario);
        return res.status(200).json({
            ok: true,
            msg: 'Usuario suspendido de la bd',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioSuspended()',
            error,
        });
    }
}

const usuarioActivatePut = async (req = request, res = response) => {
    console.log('[usuarios] usuarioActivatePut()');

    const { id } = req.params;
    try {
        const usuario = await Usuario.update({ estado: 1 }, {
            where: { id },
        });

        return res.status(200).json({
            ok: true,
            msg: 'Usuario activado',
            usuario
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor, usuarioActivatePut()',
            error,
        });
    }
}

module.exports = {
    usuariosGetAll,
    usuarioGet,
    usuarioPost,
    usuarioPut,
    usuarioDelete,
    usuariosGetAllSuspended,
    usuarioActivatePut,
    usuarioSuspended,
    usuariosGetAllDeleted,
    suspendUser
};