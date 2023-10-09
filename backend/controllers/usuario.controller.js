const { uid } = require('uid');
const bcryptjs = require('bcryptjs');
const { minioClient } = require('../minio/connection');
const { response, request } = require('express');
const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');
const Pyme = require('../models/pyme');
const DeleteUsuario = require('../models/deletedUsuario');


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

    const { page, size } = req.query;

    const pageAsNumber = Number.parseInt(page);
    const sizeAsNumber = Number.parseInt(size);

    try {
        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber
        }

        let size = 10
        if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
            size = sizeAsNumber;
        }

        const usuarios = await DeleteUsuario.findAndCountAll({
            limit: size,
            offset: page * size,

        });



        if (usuarios.count === 0) {
            res.status(200).json({
                ok: true,
                usuarios,
                msg: 'No existen usuarios eliminados en la base de datos.'
            })
        }

        if (usuarios.count > 0) {
            res.status(200).json({
                ok: true,
                totalPages: Math.ceil(usuarios.count / size),
                content: usuarios.rows,
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error,
            msg: 'Error al obtener usuarios eliminados.'
        })
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
            const url = await minioClient.presignedUrl('GET', 'images-bucket', usuario.imagen);
            console.log({ url })
            usuario.imagen = url;
        }

        return res.status(200).json(usuario);

    } catch (error) {
        console.log(error)
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

const usuarioPut = (req = request, res = response) => {

    const { id } = req.params
    console.log(id)

    res.status(200).json({
        ok: true,
        msg: 'Put Api desde controlador',
        id
    })
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