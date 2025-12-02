import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const listAccountsByCliente = async (res, clienteId) => {
    let connection = null;
    
    try {
        if (!clienteId) {
            response400(res, "ID de cliente es requerido");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_cuentas_pkg.listar_cuentas_cliente(:p_cliente_id, :cursor);
            END;`,
            {
                p_cliente_id: clienteId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = result.outBinds.cursor;
        
        const cuentas = [];
        let row;
        while ((row = await resultSet.getRow())) {
            cuentas.push({
                cuentaId: row[0],
                clienteId: clienteId,
                tipoCuentaId: row[1],
                estadoId: row[2],
                saldo: row[3]
            });
        }
        await resultSet.close();
        
        const message = cuentas.length === 0 
            ? "No se encontraron cuentas para este cliente" 
            : `Se encontraron ${cuentas.length} cuenta(s)`;
        
        response200(res, cuentas, message);
        
    } catch (error) {
        console.error('Error al listar cuentas del cliente:', error);
        
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${error.message}`);
            return;
        }
        
        response500(res, "Error al obtener la lista de cuentas");
        
    } finally {
        await closeConnection(connection);
    }
};

