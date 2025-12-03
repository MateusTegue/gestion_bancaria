import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const validarCuentaActiva = async (res, cuentaId) => {
    let connection = null;
    
    try {
        if (!cuentaId) {
            response400(res, "ID de cuenta es requerido");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                :es_activa := gestion_cuentas_pkg.validar_cuenta_activa(:p_cuenta_id);
            END;`,
            {
                es_activa: { dir: oracledb.BIND_OUT, type: oracledb.BOOLEAN },
                p_cuenta_id: cuentaId
            }
        );
        
        const esActiva = result.outBinds.es_activa;
        
        response200(res, { activa: esActiva }, "Validación realizada exitosamente");
        
    } catch (error) {
        if (error.errorNum) {
            response500(res, `Error de base de datos: ${error.message}`);
            return;
        }
        
        response500(res, "Error al validar cuenta activa");
        
    } finally {
        await closeConnection(connection);
    }
};

