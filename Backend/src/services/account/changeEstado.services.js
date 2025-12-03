import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response403, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { getEstadoCuentaDescripcion, getTipoCuentaDescripcion } from '../../utils/tipoParametros.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const changeAccountEstado = async (res, cuentaId, estadoId, usuarioId) => {
    let connection = null;
    
    try {
        console.log('=== changeAccountEstado - Inicio ===');
        console.log('cuentaId:', cuentaId, 'tipo:', typeof cuentaId);
        console.log('estadoId:', estadoId, 'tipo:', typeof estadoId);
        console.log('usuarioId:', usuarioId, 'tipo:', typeof usuarioId);
        
        if (!cuentaId) {
            response400(res, "ID de cuenta es requerido");
            return;
        }

        if (!estadoId) {
            response400(res, "ID de estado es requerido");
            return;
        }

        if (!usuarioId) {
            response400(res, "ID de usuario es requerido para esta operación");
            return;
        }

        connection = await connectDB();
        
        const pCuentaId = String(cuentaId);
        const pEstadoId = Number(estadoId);
        const pUsuarioId = Number(usuarioId);
        
        console.log('Valores convertidos:');
        console.log('pCuentaId:', pCuentaId);
        console.log('pEstadoId:', pEstadoId);
        console.log('pUsuarioId:', pUsuarioId);
        
        await connection.execute(
            `BEGIN
                gestion_cuentas_pkg.cambiar_estado_cuenta(
                    :p_cuenta_id,
                    :p_estado_id,
                    :p_usuario_id
                );
            END;`,
            {
                p_cuenta_id: pCuentaId,
                p_estado_id: pEstadoId,
                p_usuario_id: pUsuarioId
            }
        );
        
        console.log('Procedimiento ejecutado exitosamente');

        await connection.commit();
        
        const consultResult = await connection.execute(
            `SELECT 
                CUENTA_ID,
                CLIENTE_ID,
                TIPO_CUENTA_ID,
                ESTADO_ID,
                SALDO
            FROM PROYECTODB.TBL_CUENTAS
            WHERE CUENTA_ID = :cuenta_id`,
            {
                cuenta_id: cuentaId
            }
        );
        
        if (consultResult.rows.length === 0) {
            response404(res, "Error al obtener los datos de la cuenta actualizada");
            return;
        }
        
        const row = consultResult.rows[0];
        const estadoIdActualizado = row[3];
        const tipoCuentaId = row[2];
        
        const cuentaActualizada = {
            cuentaId: row[0],
            id: row[0],
            clienteId: row[1],
            numeroCuenta: String(row[0]),
            tipoCuentaId: tipoCuentaId,
            tipoCuenta: getTipoCuentaDescripcion(tipoCuentaId),
            estadoId: estadoIdActualizado,
            estado: getEstadoCuentaDescripcion(estadoIdActualizado),
            saldo: row[4] || 0
        };
        
        response200(res, cuentaActualizada, "Estado de cuenta actualizado exitosamente");
        
    } catch (error) {
        console.log('=== ERROR en changeAccountEstado ===');
        console.log('Error completo:', error);
        console.log('error.errorNum:', error.errorNum);
        console.log('error.message:', error.message);
        console.log('error.code:', error.code);
        console.log('error.stack:', error.stack);
        
        if (error.errorNum) {
            const errorNum = Math.abs(error.errorNum);
            const errorMessage = error.message || '';
            
            console.log('Error numérico detectado:', errorNum);
            console.log('Mensaje de error:', errorMessage);
            
            if (errorNum === 20013) {
                console.log('Error 20013: Usuario no es administrador');
                response403(res, "Solo administradores pueden cambiar estado de cuentas");
                return;
            }
            if (errorNum === 20014) {
                console.log('Error 20014: Cuenta no encontrada');
                response404(res, "Cuenta no encontrada");
                return;
            }
            if (errorNum === 20015) {
                console.log('Error 20015: Usuario no encontrado');
                response404(res, "Usuario no encontrado");
                return;
            }
            if (errorNum === 20016) {
                console.log('Error 20016: Error genérico en procedimiento');
                const parsedMessage = parseOracleError(error);
                response500(res, parsedMessage || errorMessage);
                return;
            }
            
            console.log('Error no reconocido, usando parseOracleError');
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage || `Error de base de datos: ${errorMessage} (Error: ${errorNum})`);
            return;
        }
        
        console.log('Error sin errorNum, error genérico');
        const errorMessage = error.message || 'Error desconocido';
        const parsedMessage = parseOracleError(error);
        console.log('Mensaje final:', parsedMessage || errorMessage);
        response500(res, parsedMessage || `Error al cambiar estado de cuenta: ${errorMessage}`);
        
    } finally {
        await closeConnection(connection);
        console.log('=== changeAccountEstado - Fin ===');
    }
};

