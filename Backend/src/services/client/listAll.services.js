import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';


export const listAllClients = async (res) => {
    let connection = null;
    
    try {
        connection = await connectDB();
        const result = await connection.execute(
            `BEGIN
                gestion_clientes_pkg.listar_clientes(:cursor);
            END;`,
            {
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = result.outBinds.cursor;
        
        const clients = [];
        let row;
        while ((row = await resultSet.getRow())) {
            clients.push({
                clienteId: row[0],
                nombre: row[1],
                identificacion: row[2],
                direccion: row[3],
                totalCuentas: row[4],
                saldoTotal: row[5]
            });
        }
        await resultSet.close();
        
        const message = clients.length === 0 
            ? "No se encontraron clientes en el sistema" 
            : `Se encontraron ${clients.length} cliente(s)`;
        
        response200(res, clients, message);
        
    } catch (error) {
        console.error('Error al listar clientes:', error);
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${error.message}`);
            return;
        }
        
        response500(res, "Error al obtener la lista de clientes");
        
    } finally {
        await closeConnection(connection);
    }
};
