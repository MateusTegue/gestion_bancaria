import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response201, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const createAccount = async (res, accountData) => {
    let connection = null;
    
    try {
        if (!accountData.cuentaId || !accountData.clienteId || !accountData.tipoCuentaId) {
            response400(res, "Los campos cuentaId, clienteId y tipoCuentaId son obligatorios");
            return;
        }

        if (accountData.saldoInicial !== undefined && accountData.saldoInicial < 0) {
            response400(res, "El saldo inicial no puede ser negativo");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_cuentas_pkg.crear_cuenta(
                    :p_cuenta_id,
                    :p_cliente_id,
                    :p_tipo_cuenta_id,
                    :p_saldo_inicial
                );
            END;`,
            {
                p_cuenta_id: accountData.cuentaId,
                p_cliente_id: accountData.clienteId,
                p_tipo_cuenta_id: accountData.tipoCuentaId,
                p_saldo_inicial: accountData.saldoInicial || 0
            }
        );

        await connection.commit();
        
        // Consultar la cuenta creada para retornar todos sus datos
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
                cuenta_id: accountData.cuentaId
            }
        );
        
        if (consultResult.rows.length === 0) {
            response500(res, "Error al obtener los datos de la cuenta creada");
            return;
        }
        
        const row = consultResult.rows[0];
        const cuentaCreada = {
            cuentaId: row[0],
            clienteId: row[1],
            tipoCuentaId: row[2],
            estadoId: row[3],
            saldo: row[4]
        };
        
        response201(res, cuentaCreada, "Cuenta creada exitosamente");
        
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        
        if (error.errorNum) {
            if (error.errorNum === -20010) {
                response400(res, "El cliente no existe en el sistema");
                return;
            }
            if (error.errorNum === -20011) {
                response400(res, "El saldo inicial no puede ser negativo");
                return;
            }
            if (error.errorNum === -20012) {
                // Parsear el error para obtener un mensaje más claro
                const parsedMessage = parseOracleError(error);
                if (parsedMessage.includes('ya existe')) {
                    response400(res, parsedMessage);
                } else {
                    response500(res, parsedMessage);
                }
                return;
            }
            
            // Para otros errores, parsear el mensaje
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage);
            return;
        }
        
        // Si no es un error de Oracle conocido, parsear igualmente
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al crear cuenta");
        
    } finally {
        await closeConnection(connection);
    }
};

