import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const realizarRetiro = async (res, cuentaId, monto, usuarioId) => {
    let connection = null;
    
    try {
        if (!cuentaId) {
            response400(res, "ID de cuenta es requerido");
            return;
        }

        if (!monto || monto <= 0) {
            response400(res, "El monto debe ser mayor a 0");
            return;
        }

        if (!usuarioId) {
            response400(res, "ID de usuario es requerido para esta operación");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                PROYECTODB.gestion_transacciones_pkg.realizar_retiro(
                    :p_cuenta_id,
                    :p_monto,
                    :p_usuario_id
                );
            END;`,
            {
                p_cuenta_id: cuentaId,
                p_monto: monto,
                p_usuario_id: usuarioId
            }
        );

        await connection.commit();
        
        // Obtener saldo actualizado
        const saldoResult = await connection.execute(
            `SELECT SALDO
            FROM PROYECTODB.TBL_CUENTAS
            WHERE CUENTA_ID = :cuenta_id`,
            {
                cuenta_id: cuentaId
            }
        );
        
        if (saldoResult.rows.length === 0) {
            response404(res, "Error al obtener el saldo actualizado");
            return;
        }
        
        const saldoActualizado = saldoResult.rows[0][0];
        
        const retiroData = {
            cuentaId: cuentaId,
            monto: monto,
            saldoActualizado: saldoActualizado,
            fecha: new Date().toISOString()
        };
        
        response200(res, retiroData, "Retiro realizado exitosamente");
        
    } catch (error) {
        console.error('Error al realizar retiro:', error);
        
        if (error.errorNum) {
            const errorNum = Math.abs(error.errorNum);
            
            if (errorNum === 20001) {
                response404(res, "Cuenta inexistente o no activa");
                return;
            }
            if (errorNum === 20002) {
                // Extraer el número de cuenta del mensaje si está disponible
                const errorMessage = error.message || '';
                const cuentaMatch = errorMessage.match(/cuenta\s+([A-Z0-9_]+)/i);
                if (cuentaMatch) {
                    response400(res, `Fondos insuficientes en la cuenta ${cuentaMatch[1]}. Por favor, verifique el saldo disponible.`);
                } else {
                    response400(res, `Fondos insuficientes en la cuenta ${cuentaId}. Por favor, verifique el saldo disponible.`);
                }
                return;
            }
            if (errorNum === 20011) {
                response400(res, "El monto debe ser mayor a 0");
                return;
            }
            
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage || "Error al realizar retiro");
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al realizar retiro");
        
    } finally {
        await closeConnection(connection);
    }
};

