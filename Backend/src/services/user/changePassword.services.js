import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const changePassword = async (res, passwordData) => {
    let connection = null;
    
    try {
        if (!passwordData.usuarioId || !passwordData.passwordActual || !passwordData.passwordNuevo) {
            response400(res, "Los campos usuarioId, passwordActual y passwordNuevo son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_usuarios_pkg.cambiar_password(
                    :p_usuario_id,
                    :p_password_actual,
                    :p_password_nuevo
                );
            END;`,
            {
                p_usuario_id: passwordData.usuarioId,
                p_password_actual: passwordData.passwordActual,
                p_password_nuevo: passwordData.passwordNuevo
            }
        );

        await connection.commit();
        
        response200(res, null, "Contraseña actualizada exitosamente");

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Error al hacer rollback:", rollbackError);
            }
        }

        const parsedError = parseOracleError(error);
        
        if (parsedError.code === -20110) {
            response400(res, "La contraseña actual no es correcta");
        } else if (parsedError.code === -20105) {
            response400(res, "La nueva contraseña debe tener al menos 6 caracteres");
        } else if (parsedError.code === -20107) {
            response400(res, "Usuario no encontrado");
        } else {
            response500(res, `Error al cambiar contraseña: ${parsedError.message}`);
        }
    } finally {
        await closeConnection(connection);
    }
};
