import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const consultarSaldo = async (res, cuentaId) => {
    let connection = null;
    
    try {
        if (!cuentaId) {
            response400(res, "ID de cuenta es requerido");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                :saldo := gestion_cuentas_pkg.consultar_saldo(:p_cuenta_id);
            END;`,
            {
                saldo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                p_cuenta_id: cuentaId
            }
        );
        
        const saldo = result.outBinds.saldo;
        
        if (saldo === null || saldo === undefined) {
            response404(res, "Cuenta no encontrada");
            return;
        }
        
        response200(res, { cuentaId, saldo }, "Saldo consultado exitosamente");
        
    } catch (error) {
        console.error('Error al consultar saldo:', error);
        
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            
            if (error.errorNum === -20016) {
                response404(res, "Cuenta no encontrada");
                return;
            }
            
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        response500(res, "Error al consultar saldo");
        
    } finally {
        await closeConnection(connection);
    }
};

