import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response403, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const deleteClient = async (res, clienteId, usuarioId) => {
    let connection = null;
    
    try {
        if (!clienteId) {
            response400(res, "ID de cliente es requerido");
            return;
        }

        if (!usuarioId) {
            response400(res, "ID de usuario es requerido para esta operación");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_clientes_pkg.eliminar_cliente(
                    :p_cliente_id,
                    :p_usuario_id
                );
            END;`,
            {
                p_cliente_id: clienteId,
                p_usuario_id: usuarioId
            }
        );

        await connection.commit();
        
        response200(res, { clienteId }, "Cliente eliminado exitosamente");
        
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            
            if (error.errorNum === -20003) {
                response404(res, "Cliente no encontrado");
                return;
            }
            if (error.errorNum === -20007) {
                response403(res, "Solo administradores pueden eliminar clientes");
                return;
            }
            if (error.errorNum === -20008) {
                response400(res, "No se puede eliminar cliente con cuentas activas. Primero desactive las cuentas.");
                return;
            }
            if (error.errorNum === -20009) {
                response404(res, "Usuario no encontrado");
                return;
            }
            
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        response500(res, "Error al eliminar cliente");
        
    } finally {
        await closeConnection(connection);
    }
};

