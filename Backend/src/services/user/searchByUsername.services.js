import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const searchUserByUsername = async (res, usuario) => {
    let connection = null;
    
    try {
        if (!usuario) {
            response400(res, "El parámetro usuario es obligatorio");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.buscar_usuario_por_nombre(:p_usuario, :cursor);
            END;`,
            {
                p_usuario: usuario,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );

        const resultSet = result.outBinds.cursor;
        const rows = await resultSet.getRows(1000);
        await resultSet.close();

        const users = rows.map(row => ({
            usuarioId: row[0],
            usuario: row[1],
            rol: row[2],
            clienteId: row[3],
            nombreCliente: row[4]
        }));

        response200(res, users, "Búsqueda completada");

    } catch (error) {
        const parsedError = parseOracleError(error);
        response500(res, `Error al buscar usuario: ${parsedError.message}`);
    } finally {
        await closeConnection(connection);
    }
};
