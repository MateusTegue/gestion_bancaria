import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response403, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const changeAccountEstado = async (res, cuentaId, estadoId, usuarioId) => {
    let connection = null;
    
    try {
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
        
        await connection.execute(
            `BEGIN
                gestion_cuentas_pkg.cambiar_estado_cuenta(
                    :p_cuenta_id,
                    :p_estado_id,
                    :p_usuario_id
                );
            END;`,
            {
                p_cuenta_id: cuentaId,
                p_estado_id: estadoId,
                p_usuario_id: usuarioId
            }
        );

        await connection.commit();
        
        // Consultar la cuenta actualizada
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
        const cuentaActualizada = {
            cuentaId: row[0],
            clienteId: row[1],
            tipoCuentaId: row[2],
            estadoId: row[3],
            saldo: row[4]
        };
        
        response200(res, cuentaActualizada, "Estado de cuenta actualizado exitosamente");
        
    } catch (error) {
        console.error('Error al cambiar estado de cuenta:', error);
        
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            
            if (error.errorNum === -20013) {
                response403(res, "Solo administradores pueden cambiar estado de cuentas");
                return;
            }
            if (error.errorNum === -20014) {
                response404(res, "Cuenta no encontrada");
                return;
            }
            if (error.errorNum === -20015) {
                response404(res, "Usuario no encontrado");
                return;
            }
            
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        response500(res, "Error al cambiar estado de cuenta");
        
    } finally {
        await closeConnection(connection);
    }
};

