import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response201, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';
import { getEstadoCuentaDescripcion, getTipoCuentaDescripcion } from '../../utils/tipoParametros.js';

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
        const tipoCuentaId = row[2];
        const estadoId = row[3];
        
        const cuentaCreada = {
            cuentaId: row[0],
            clienteId: row[1],
            tipoCuentaId: tipoCuentaId,
            tipoCuenta: getTipoCuentaDescripcion(tipoCuentaId),
            estadoId: estadoId,
            estado: getEstadoCuentaDescripcion(estadoId),
            saldo: row[4]
        };
        
        response201(res, cuentaCreada, "Cuenta creada exitosamente");
        
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        
        if (error.errorNum) {
            const errorNum = Math.abs(error.errorNum);
            
            if (errorNum === 20010) {
                response400(res, "El cliente no existe en el sistema");
                return;
            }
            if (errorNum === 20011) {
                response400(res, "El saldo inicial no puede ser negativo");
                return;
            }
            if (errorNum === 20012) {
                // Detectar si es un error de cuenta duplicada
                const errorMessage = error.message || '';
                if (errorMessage.includes('ORA-00001') || errorMessage.includes('restricción única') || errorMessage.includes('PK_CUENTA_ID')) {
                    // Extraer el número de cuenta del mensaje si está disponible
                    const cuentaMatch = errorMessage.match(/cuenta\s+([A-Z0-9_]+)/i) || 
                                      errorMessage.match(/CUENTA_ID[^)]*\)/i);
                    if (cuentaMatch && accountData.cuentaId) {
                        response400(res, `Ya existe una cuenta con el número ${accountData.cuentaId}. Por favor, ingrese un número de cuenta diferente.`);
                    } else {
                        response400(res, "Ya existe una cuenta con este número. Por favor, ingrese un número de cuenta diferente.");
                    }
                } else {
                    const parsedMessage = parseOracleError(error);
                    response400(res, parsedMessage);
                }
                return;
            }
            
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage);
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al crear cuenta");
        
    } finally {
        await closeConnection(connection);
    }
};

