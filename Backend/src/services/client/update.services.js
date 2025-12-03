import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response404, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';

export const updateClient = async (res, clienteId, clientData) => {
    let connection = null;
    
    try {
        if (!clienteId) {
            response400(res, "ID de cliente es requerido");
            return;
        }

        if (!clientData.primerNombre || !clientData.primerApellido) {
            response400(res, "Primer nombre y primer apellido son obligatorios");
            return;
        }

        connection = await connectDB();
        
        await connection.execute(
            `BEGIN
                gestion_clientes_pkg.actualizar_cliente(
                    :p_cliente_id,
                    :p_primer_nombre,
                    :p_segundo_nombre,
                    :p_primer_apellido,
                    :p_segundo_apellido,
                    :p_direccion
                );
            END;`,
            {
                p_cliente_id: clienteId,
                p_primer_nombre: clientData.primerNombre,
                p_segundo_nombre: clientData.segundoNombre || null,
                p_primer_apellido: clientData.primerApellido,
                p_segundo_apellido: clientData.segundoApellido || null,
                p_direccion: clientData.direccion || null
            }
        );

        await connection.commit();
        
        const consultResult = await connection.execute(
            `BEGIN
                gestion_clientes_pkg.consultar_cliente(:p_cliente_id, :cursor);
            END;`,
            {
                p_cliente_id: clienteId,
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );
        
        const resultSet = consultResult.outBinds.cursor;
        const row = await resultSet.getRow();
        await resultSet.close();
        
        if (!row) {
            response404(res, "Error al obtener los datos del cliente actualizado");
            return;
        }
        
        const clienteActualizado = {
            id: row[0],
            identificacion: String(row[6] || ''),
            nombre: `${row[1] || ''} ${row[2] || ''}`.trim() || row[5] || '',
            apellido: `${row[3] || ''} ${row[4] || ''}`.trim() || '',
            direccion: row[7] || '',
            telefono: undefined,
            email: undefined
        };
        
        response200(res, clienteActualizado, "Cliente actualizado exitosamente");
        
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            
            if (error.errorNum === -20003) {
                response404(res, "Cliente no encontrado");
                return;
            }
            if (error.errorNum === -20004) {
                response400(res, "Primer nombre y primer apellido son obligatorios");
                return;
            }
            if (error.errorNum === -20006) {
                response500(res, `Error al actualizar cliente: ${errorMessage}`);
                return;
            }
            
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        response500(res, "Error al actualizar cliente");
        
    } finally {
        await closeConnection(connection);
    }
};

