import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const getUserById = async (res, usuarioId) => {
    let connection = null;
    
    try {
        if (!usuarioId) {
            response400(res, "El campo usuarioId es obligatorio");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.consultar_usuario(:p_usuario_id, :cursor);
            END;`,
            {
                p_usuario_id: usuarioId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );

        const resultSet = result.outBinds.cursor;
        const rows = await resultSet.getRows();
        await resultSet.close();

        if (rows.length === 0) {
            response404(res, "Usuario no encontrado");
            return;
        }

        const [row] = rows;
        const user = {
            usuarioId: row[0],
            rolId: row[1],
            rolNombre: row[2],
            clienteId: row[3],
            nombreCliente: row[4],
            usuario: row[5]
        };

        response200(res, user, "Usuario consultado exitosamente");

    } catch (error) {
        const parsedError = parseOracleError(error);
        response500(res, `Error al consultar usuario: ${parsedError.message}`);
    } finally {
        await closeConnection(connection);
    }
};
