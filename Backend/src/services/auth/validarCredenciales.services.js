import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response401, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const validarCredenciales = async (res, usuario, password) => {
    let connection = null;
    
    try {
        if (!usuario || !password) {
            response400(res, "Usuario y contraseña son requeridos");
            return;
        }

        connection = await connectDB();
        
        const result = await connection.execute(
            `BEGIN
                :usuario_id := autenticacion_pkg.validar_credenciales(:p_usuario, :p_password);
            END;`,
            {
                usuario_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                p_usuario: usuario,
                p_password: password
            }
        );
        
        const usuarioId = result.outBinds.usuario_id;
        
        if (usuarioId === -1 || usuarioId === null || usuarioId === undefined) {
            response401(res, "Credenciales inválidas");
            return;
        }
        
        // Obtener información del usuario con el nombre del rol y clienteId
        const userResult = await connection.execute(
            `SELECT 
                u.USUARIO_ID,
                u.USUARIO,
                u.ROL_ID,
                r.NOMBRE as ROL_NOMBRE,
                u.CLIENTE_ID
            FROM PROYECTODB.TBL_USUARIOS u
            INNER JOIN PROYECTODB.TBL_ROLES r ON u.ROL_ID = r.ROL_ID
            WHERE u.USUARIO_ID = :usuario_id`,
            {
                usuario_id: usuarioId
            }
        );
        
        if (userResult.rows.length === 0) {
            response401(res, "Usuario no encontrado");
            return;
        }
        
        const row = userResult.rows[0];
        const usuarioData = {
            usuarioId: row[0],
            usuario: row[1],
            rolId: row[2],
            rolNombre: row[3],
            clienteId: row[4] || null
        };
        
        response200(res, usuarioData, "Autenticación exitosa");
        
    } catch (error) {
        console.error('Error al validar credenciales:', error);
        
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            
            if (error.errorNum === -20050) {
                const parsedMessage = parseOracleError(error);
                response500(res, parsedMessage);
                return;
            }
            
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al validar credenciales");
        
    } finally {
        await closeConnection(connection);
    }
};

