import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response201, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const createClient = async (res, clientData) => {
    let connection = null;
    
    try {
        if (!clientData.clienteId || !clientData.primerNombre || !clientData.primerApellido || !clientData.identificacion) {
            response400(res, "Los campos clienteId, primerNombre, primerApellido e identificacion son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_clientes_pkg.crear_cliente(
                    :p_cliente_id,
                    :p_primer_nombre,
                    :p_segundo_nombre,
                    :p_primer_apellido,
                    :p_segundo_apellido,
                    :p_identificacion,
                    :p_direccion
                );
            END;`,
            {
                p_cliente_id: clientData.clienteId,
                p_primer_nombre: clientData.primerNombre,
                p_segundo_nombre: clientData.segundoNombre || null,
                p_primer_apellido: clientData.primerApellido,
                p_segundo_apellido: clientData.segundoApellido || null,
                p_identificacion: clientData.identificacion,
                p_direccion: clientData.direccion || null
            }
        );

        await connection.commit();
        
        const consultResult = await connection.execute(
            `BEGIN
                gestion_clientes_pkg.consultar_cliente(:p_cliente_id, :cursor);
            END;`,
            {
                p_cliente_id: clientData.clienteId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = consultResult.outBinds.cursor;
        const row = await resultSet.getRow();
        await resultSet.close();
        
        if (!row) {
            response500(res, "Error al obtener los datos del cliente creado");
            return;
        }
        
        const clienteCreado = {
            clienteId: row[0],
            primerNombre: row[1],
            segundoNombre: row[2],
            primerApellido: row[3],
            segundoApellido: row[4],
            nombreCompleto: row[5],
            identificacion: row[6],
            direccion: row[7],
            totalCuentas: row[8],
            saldoTotal: row[9]
        };
        
        response201(res, clienteCreado, "Cliente creado exitosamente");
        
    } catch (error) {
        if (error.errorNum) {
            if (error.errorNum === -20001) {
                response400(res, "El cliente ya existe en el sistema");
                return;
            }
            if (error.errorNum === -20002) {
                const parsedMessage = parseOracleError(error);
                if (parsedMessage.includes('ya existe')) {
                    response400(res, parsedMessage);
                } else {
                    response500(res, parsedMessage);
                }
                return;
            }
            if (error.errorNum === -20004) {
                response400(res, "Primer nombre y primer apellido son obligatorios");
                return;
            }
            if (error.errorNum === -20005) {
                response400(res, "Identificación inválida");
                return;
            }
            
            const parsedMessage = parseOracleError(error);
            response500(res, parsedMessage);
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al crear cliente");
        
    } finally {
        await closeConnection(connection);
    }
};
    