import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const listAllUsers = async (res) => {
    let connection = null;
    
    try {
        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.listar_usuarios(:cursor);
            END;`,
            {
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

        response200(res, users, "Usuarios listados exitosamente");

    } catch (error) {
        const parsedError = parseOracleError(error);
        response500(res, `Error al listar usuarios: ${parsedError.message}`);
    } finally {
        await closeConnection(connection);
    }
};
