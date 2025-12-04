import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response403, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const resetPassword = async (res, resetData) => {
    let connection = null;
    
    try {
        if (!resetData.usuarioId || !resetData.passwordNuevo || !resetData.adminId) {
            response400(res, "Los campos usuarioId, passwordNuevo y adminId son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.resetear_password(
                    :p_usuario_id,
                    :p_password_nuevo,
                    :p_admin_id
                );
            END;`,
            {
                p_usuario_id: resetData.usuarioId,
                p_password_nuevo: resetData.passwordNuevo,
                p_admin_id: resetData.adminId
            }
        );

        await connection.commit();
        
        response200(res, null, "Contraseña reseteada exitosamente");

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        const parsedError = parseOracleError(error);
        
        if (parsedError.code === -20111) {
            response403(res, "Solo administradores pueden resetear contraseñas");
        } else if (parsedError.code === -20105) {
            response400(res, "La nueva contraseña debe tener al menos 6 caracteres");
        } else if (parsedError.code === -20107) {
            response400(res, "Usuario no encontrado");
        } else {
            response500(res, `Error al resetear contraseña: ${parsedError.message}`);
        }
    } finally {
        await closeConnection(connection);
    }
};
