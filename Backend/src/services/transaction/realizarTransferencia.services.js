import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const realizarTransferencia = async (res, cuentaOrigen, cuentaDestino, monto, usuarioId) => {
    let connection = null;
    
    try {
        if (!cuentaOrigen) {
            response400(res, "ID de cuenta origen es requerido");
            return;
        }

        if (!cuentaDestino) {
            response400(res, "ID de cuenta destino es requerido");
            return;
        }

        if (cuentaOrigen === cuentaDestino) {
            response400(res, "La cuenta origen y destino no pueden ser la misma");
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
                PROYECTODB.gestion_transacciones_pkg.realizar_transferencia(
                    :p_cuenta_origen,
                    :p_cuenta_destino,
                    :p_monto,
                    :p_usuario_id
                );
            END;`,
            {
                p_cuenta_origen: cuentaOrigen,
                p_cuenta_destino: cuentaDestino,
                p_monto: monto,
                p_usuario_id: usuarioId
            }
        );

        await connection.commit();
        
        // Obtener saldos actualizados
        const saldosResult = await connection.execute(
            `SELECT 
                CUENTA_ID,
                SALDO
            FROM PROYECTODB.TBL_CUENTAS
            WHERE CUENTA_ID IN (:cuenta_origen, :cuenta_destino)`,
            {
                cuenta_origen: cuentaOrigen,
                cuenta_destino: cuentaDestino
            }
        );
        
        if (saldosResult.rows.length !== 2) {
            response404(res, "Error al obtener los saldos actualizados");
            return;
        }
        
        let saldoOrigen = null;
        let saldoDestino = null;
        
        saldosResult.rows.forEach(row => {
            if (row[0] === cuentaOrigen) {
                saldoOrigen = row[1];
            } else if (row[0] === cuentaDestino) {
                saldoDestino = row[1];
            }
        });
        
        const transferenciaData = {
            cuentaOrigen: cuentaOrigen,
            cuentaDestino: cuentaDestino,
            monto: monto,
            saldoOrigen: saldoOrigen,
            saldoDestino: saldoDestino,
            fecha: new Date().toISOString()
        };
        
        response200(res, transferenciaData, "Transferencia realizada exitosamente");
        
    } catch (error) {
        console.error('Error al realizar transferencia:', error);
        
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
                    response400(res, `Fondos insuficientes en la cuenta origen ${cuentaMatch[1]}. Por favor, verifique el saldo disponible.`);
                } else {
                    response400(res, `Fondos insuficientes en la cuenta origen ${cuentaOrigen}. Por favor, verifique el saldo disponible.`);
                }
                return;
            }
            if (errorNum === 20012) {
                response400(res, "La cuenta origen y destino no pueden ser la misma");
                return;
            }
            
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage || "Error al realizar transferencia");
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al realizar transferencia");
        
    } finally {
        await closeConnection(connection);
    }
};

