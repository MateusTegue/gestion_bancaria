import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const searchClientByIdentificacion = async (res, identificacion) => {
    let connection = null;
    
    try {
        if (!identificacion) {
            response400(res, "Número de identificación es requerido");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_clientes_pkg.buscar_cliente_por_identificacion(:p_identificacion, :cursor);
            END;`,
            {
                p_identificacion: identificacion,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = result.outBinds.cursor;
        const row = await resultSet.getRow();
        await resultSet.close();
        
        if (!row) {
            response404(res, "Cliente no encontrado con la identificación proporcionada");
            return;
        }
        
        const cliente = {
            clienteId: row[0],
            primerNombre: row[1],
            segundoNombre: row[2],
            primerApellido: row[3],
            segundoApellido: row[4],
            identificacion: row[5],
            direccion: row[6]
        };
        
        response200(res, cliente, "Cliente encontrado exitosamente");
        
    } catch (error) {
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${error.message}`);
            return;
        }
        
        response500(res, "Error al buscar el cliente");
        
    } finally {
        await closeConnection(connection);
    }
};

