import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { getEstadoCuentaDescripcion, getTipoCuentaDescripcion } from '../../utils/tipoParametros.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const listAllAccounts = async (res) => {
    let connection = null;
    
    try {
        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                gestion_cuentas_pkg.listar_todas_cuentas(:cursor);
            END;`,
            {
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = result.outBinds.cursor;
        
        const cuentas = [];
        let row;
        while ((row = await resultSet.getRow())) {
            const tipoCuentaId = row[2];
            const estadoId = row[3];
            
            cuentas.push({
                cuentaId: row[0],
                id: row[0],
                clienteId: row[1],
                numeroCuenta: String(row[0]),
                tipoCuentaId: tipoCuentaId,
                tipoCuenta: getTipoCuentaDescripcion(tipoCuentaId),
                estadoId: estadoId,
                estado: getEstadoCuentaDescripcion(estadoId),
                saldo: row[4] || 0
            });
        }
        await resultSet.close();
        
        const message = cuentas.length === 0 
            ? "No se encontraron cuentas" 
            : `Se encontraron ${cuentas.length} cuenta(s)`;
        
        response200(res, cuentas, message);
        
    } catch (error) {
        const parsedMessage = parseOracleError(error);
        const errorMessage = parsedMessage || error.message || 'Error desconocido';
        
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        response500(res, `Error al obtener la lista de cuentas: ${errorMessage}`);
        
    } finally {
        await closeConnection(connection);
    }
};

