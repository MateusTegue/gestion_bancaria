import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response201, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const createUser = async (res, userData) => {
    let connection = null;
    
    try {
        if (!userData.usuarioId || !userData.rolId || !userData.usuario || !userData.password) {
            response400(res, "Los campos usuarioId, rolId, usuario y password son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.crear_usuario(
                    :p_usuario_id,
                    :p_rol_id,
                    :p_cliente_id,
                    :p_usuario,
                    :p_password
                );
            END;`,
            {
                p_usuario_id: userData.usuarioId,
                p_rol_id: userData.rolId,
                p_cliente_id: userData.clienteId || null,
                p_usuario: userData.usuario,
                p_password: userData.password
            }
        );

        await connection.commit();
        
        const consultResult = await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.consultar_usuario(:p_usuario_id, :cursor);
            END;`,
            {
                p_usuario_id: userData.usuarioId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );

        const resultSet = consultResult.outBinds.cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        if (rows.length === 0) {
            response400(res, "No se pudo recuperar la información del usuario creado");
            return;
        }

        const [row] = rows;
        const userCreated = {
            usuarioId: row[0],
            rolId: row[1],
            rolNombre: row[2],
            clienteId: row[3],
            nombreCliente: row[4],
            usuario: row[5]
        };

        response201(res, userCreated, "Usuario creado exitosamente");

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        const parsedError = parseOracleError(error);
        
        if (parsedError.code === -20101) {
            response400(res, "El usuario ya existe en el sistema");
        } else if (parsedError.code === -20102) {
            response400(res, "El rol especificado no existe");
        } else if (parsedError.code === -20103) {
            response400(res, "El cliente especificado no existe");
        } else if (parsedError.code === -20104) {
            response400(res, "Usuario y contraseña son obligatorios");
        } else if (parsedError.code === -20105) {
            response400(res, "La contraseña debe tener al menos 6 caracteres");
        } else {
            response500(res, `Error al crear usuario: ${parsedError.message}`);
        }
    } finally {
        await closeConnection(connection);
    }
};
