const { uid } = require('uid');
const bcryptjs = require('bcryptjs');
const { minioClient } = require('../minio/connection');
const { response, request } = require('express');
const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');
const DeleteUsuario = require('../models/deletedUsuario');
const db = require('../db/connection');


const usuariosGetAll = async (req = request, res = response) => {
    console.log('[usuarios] usuariosGetAll()');

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const filter = { estado: true };

    if (req.query.nombre) {
        filter.titulo = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
                },
            ],
        };
    };

    console.log({ filter });

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
            return res.status(200).json({
                message: 'No se encontraron coincidencias.',
                usuarios: [],
            });
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error({ error });
        return res.status(500).json(
            { error: 'Error en el servidor' },
            error,
        );
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

    const filter = {
        estado: false,
    };

    if (req.query.nombreUsuario) {
        filter.titulo = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
                },
            ],
        };
    };

    console.log({ filter });

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
            return res.status(200).json({
                message: 'No se encontraron coincidencias.',
                usuarios: [],
            });
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error({ error });
        return res.status(500).json(
            { error: 'Error en el servidor' },
            error,
        );
    }
}

const usuariosGetAllDeleted = async (req = request, res = response) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    const filter = {};

    if (req.query.nombreUsuario) {
        filter.titulo = {
            [Sequelize.Op.and]: [
                Sequelize.fn('LOWER', Sequelize.col('nombreUsuario')),
                {
                    [Sequelize.Op.like]: `%${req.query.titulo.toLowerCase()}%`,
                },
            ],
        };
    };

    console.log({ filter });

    try {
        const { count, rows: usuarios } =
            await DeleteUsuario.findAndCountAll({
                where: filter,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            });

        if (!usuarios.length) {
            return res.status(200).json({
                message: 'No se encontraron coincidencias.',
                usuarios: [],
            });
        };

        return res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize,
            usuarios,
        });

    } catch (error) {
        console.error({ error });
        return res.status(500).json(
            { error: 'Error en el servidor' },
            error,
        );
    }
}

const usuarioGet = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id, {
            where: { estado: true },
            include: [
                {
                    model: Pyme,
                    where: { estado: true },
                },
            ],
        })

        if (!usuario) {
            return res.status(400).json({
                msg: `No existe usuario con id: ${id}`
            })
        }

        if (usuario.imagen) {
            const method = 'GET';
            const nameBucket = 'images-bucket';
            const pathImage = usuario.imagen;
            const expiration = (3600 * 24 * 7);  // (segundos * horas * dias)

            const url = await minioClient.presignedUrl(
                method,
                nameBucket,
                pathImage,
                expiration
            );

            console.log({ url });
            usuario.imagen = url;
        }

        return res.status(200).json(usuario);

    } catch (error) {
        console.log({ error });
    }
}

const usuarioPost = async (req = request, res = response) => {
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

        res.status(200).json({
            msg: 'nuevo usuario creado'
        })
    } catch (error) {
        console.log(error)
    }

}

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
            transaction, // Asocia la transacción a la consulta
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
        // Actualiza los campos del usuario con la información proporcionada 
        await usuario.update(userMapped, { transaction });

        // Si existe información de la empresa (Pyme) en la solicitud, y hay campos en pymeMapped, actualiza también esa información
        if (usuario.Pyme && Object.keys(pymeMapped).length > 0) {
            await usuario.Pyme.update(pymeMapped, { transaction });
        }

        // Confirma la transacción
        await transaction.commit();

        res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado correctamente',
            usuario,
        });
    } catch (error) {
        console.log(error);
        // Si ocurre un error, revierte la transacción
        await transaction.rollback();
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el usuario',
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

/**
 *  Elimina el usuario de la tabla usuario, añade usuario eliminado a lista negra
 * @param {request} req 
 * @param {response} res 
 * @returns Usuario eliminado de la bd 
 */
const usuarioDelete = async (req = request, res = response) => {

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

        console.log('usuarioEliminado', usuarioEliminado)

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
        }

        try {
            await DeleteUsuario.create(deleteUsuario, {});

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                ok: false,
                msg: 'Error al añadir usuario a lista de eliminados'
            })
        }

        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado de la bd'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar usuario'
        })
    }
}

const suspendUser = async (req = request, res = response) => {
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
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al suspender usuario',
        });
    }
}

const usuarioSuspended = async (req = request, res = response) => {
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

        console.log('usuario', usuario);
        res.status(200).json({
            ok: true,
            msg: 'Usuario suspendido de la bd',
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al suspender usuario',
        });
    }
}

const usuarioActivatePut = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.update({ estado: 1 }, {
            where: { id },
        });

        res.status(200).json({
            ok: true,
            msg: 'Usuario activado',
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error al activar usuario',
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