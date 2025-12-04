import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const updateUser = async (res, userData) => {
    let connection = null;
    
    try {
        if (!userData.usuarioId || !userData.rolId || !userData.usuario) {
            response400(res, "Los campos usuarioId, rolId y usuario son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.actualizar_usuario(
                    :p_usuario_id,
                    :p_rol_id,
                    :p_cliente_id,
                    :p_usuario
                );
            END;`,
            {
                p_usuario_id: userData.usuarioId,
                p_rol_id: userData.rolId,
                p_cliente_id: userData.clienteId || null,
                p_usuario: userData.usuario
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
            response400(res, "Usuario no encontrado");
            return;
        }

        const [row] = rows;
        const userUpdated = {
            usuarioId: row[0],
            rolId: row[1],
            rolNombre: row[2],
            clienteId: row[3],
            nombreCliente: row[4],
            usuario: row[5]
        };

        response200(res, userUpdated, "Usuario actualizado exitosamente");

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        const parsedError = parseOracleError(error);
        
        if (parsedError.code === -20107) {
            response400(res, "Usuario no encontrado");
        } else if (parsedError.code === -20108) {
            response400(res, "El nombre de usuario ya está en uso");
        } else if (parsedError.code === -20102) {
            response400(res, "El rol especificado no existe");
        } else if (parsedError.code === -20103) {
            response400(res, "El cliente especificado no existe");
        } else {
            response500(res, `Error al actualizar usuario: ${parsedError.message}`);
        }
    } finally {
        await closeConnection(connection);
    }
};
