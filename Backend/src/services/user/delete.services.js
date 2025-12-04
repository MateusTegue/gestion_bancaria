import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response403, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const deleteUser = async (res, usuarioId, adminId) => {
    let connection = null;
    
    try {
        if (!usuarioId || !adminId) {
            response400(res, "Los campos usuarioId y adminId son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.eliminar_usuario(
                    :p_usuario_id,
                    :p_admin_id
                );
            END;`,
            {
                p_usuario_id: usuarioId,
                p_admin_id: adminId
            }
        );

        await connection.commit();
        
        response200(res, null, "Usuario eliminado exitosamente");

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        console.error("Error al eliminar usuario:", error);
        
        const errorCode = Math.abs(error.errorNum || 0);
        
        if (errorCode === 20111) {
            response403(res, "Solo administradores pueden eliminar usuarios");
        } else if (errorCode === 20112) {
            response400(res, "No puede eliminar su propio usuario");
        } else if (errorCode === 20107) {
            response400(res, "Usuario no encontrado");
        } else {
            const parsedMessage = parseOracleError(error);
            response500(res, `Error al eliminar usuario: ${parsedMessage}`);
        }
    } finally {
        await closeConnection(connection);
    }
};
