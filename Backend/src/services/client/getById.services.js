import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const getClientById = async (res, clienteId) => {
    let connection = null;
    
    try {
        if (!clienteId) {
            response404(res, "ID de cliente es requerido");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_clientes_pkg.consultar_cliente(:p_cliente_id, :cursor);
            END;`,
            {
                p_cliente_id: clienteId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = result.outBinds.cursor;
        const row = await resultSet.getRow();
        await resultSet.close();
        
        if (!row) {
            response404(res, "Cliente no encontrado");
            return;
        }
        
        const cliente = {
            clienteId: row[0],
            primerNombre: row[1],
            segundoNombre: row[2],
            primerApellido: row[3],
            segundoApellido: row[4],
            nombreCompleto: row[5],
            identificacion: row[6],
            direccion: row[7],
            totalCuentas: row[8],
            saldoTotal: row[9]
        };
        
        response200(res, cliente, "Cliente encontrado exitosamente");
        
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${error.message}`);
            return;
        }
        
        response500(res, "Error al obtener el cliente");
        
    } finally {
        await closeConnection(connection);
    }
};

