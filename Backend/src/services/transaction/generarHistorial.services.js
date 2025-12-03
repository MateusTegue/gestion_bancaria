import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const generarHistorial = async (res, cuentaId, fechaInicio, fechaFin) => {
    let connection = null;
    
    try {
        if (!cuentaId) {
            response400(res, "ID de cuenta es requerido");
            return;
        }

        if (!fechaInicio || !fechaFin) {
            response400(res, "Fecha inicio y fecha fin son requeridas");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                :cursor := gestion_transacciones_pkg.generar_historial(
                    :p_cuenta_id,
                    :p_fecha_inicio,
                    :p_fecha_fin
                );
            END;`,
            {
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                p_cuenta_id: cuentaId,
                p_fecha_inicio: fechaInicio,
                p_fecha_fin: fechaFin
            }
        );
        
        const resultSet = result.outBinds.cursor;
        
        if (!resultSet) {
            response404(res, "No se pudo generar el historial");
            return;
        }
        
        const transacciones = [];
        let row;
        while ((row = await resultSet.getRow())) {
            transacciones.push({
                transaccionId: row[0],
                cuentaId: row[1],
                tipoTransaccion: row[2],
                monto: row[3],
                fechaTransaccion: row[4]
            });
        }
        await resultSet.close();
        
        const message = transacciones.length === 0 
            ? "No se encontraron transacciones en el rango de fechas especificado" 
            : `Se encontraron ${transacciones.length} transacción(es)`;
        
        response200(res, transacciones, message);
        
    } catch (error) {
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al generar historial");
        
    } finally {
        await closeConnection(connection);
    }
};

