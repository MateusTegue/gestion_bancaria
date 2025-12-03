import oracledb from 'oracledb';
import { connectDB } from '../../database/conexiondb.js';
import { response200, response400, response500 } from '../../utils/responses.js';
import { closeConnection } from '../../utils/closeConnection.js';
import { parseOracleError } from '../../utils/parseOracleError.js';

export const listarHistorialUsuario = async (res, usuarioId, fechaInicio, fechaFin) => {
    let connection = null;
    
    try {
        if (!usuarioId) {
            response400(res, "ID de usuario es requerido");
            return;
        }

        connection = await connectDB();
        
        const userResult = await connection.execute(
            `SELECT 
                u.USUARIO_ID,
                u.ROL_ID,
                u.CLIENTE_ID
            FROM PROYECTODB.TBL_USUARIOS u
            WHERE u.USUARIO_ID = :usuario_id`,
            {
                usuario_id: usuarioId
            }
        );
        
        if (userResult.rows.length === 0) {
            response400(res, "Usuario no encontrado");
            return;
        }
        
        const row = userResult.rows[0];
        const rolId = row[1];
        const clienteId = row[2];
        
        if (rolId === 3 && clienteId) {
            const cuentasResult = await connection.execute(
                `BEGIN
                    gestion_cuentas_pkg.listar_cuentas_cliente(:p_cliente_id, :cursor);
                END;`,
                {
                    p_cliente_id: Number(clienteId),
                    cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                }
            );
            
            const cuentasSet = cuentasResult.outBinds.cursor;
            const cuentaIds = [];
            let cuentaRow;
            while ((cuentaRow = await cuentasSet.getRow())) {
                cuentaIds.push(cuentaRow[0]);
            }
            await cuentasSet.close();
            
            if (cuentaIds.length === 0) {
                response200(res, [], "El cliente no tiene cuentas asociadas");
                return;
            }
            
            const cuentaIdsList = cuentaIds.map(id => `'${id}'`).join(', ');
            let query = `
                SELECT t.TRANSACCION_ID,
                       t.CUENTA_ID,
                       tp.DESCRIPCION AS TIPO_TRANSACCION,
                       t.MONTO,
                       t.FECHA_TRANSACCION
                FROM PROYECTODB.TBL_TRANSACCIONES t
                LEFT JOIN PROYECTODB.TBL_TIPO_PARAMETROS tp
                  ON tp.TIPO_PARAMETRO_ID = t.TIPO_TRANSACCION_ID
                 AND tp.NOMBRE = 'Tipo-Transac'
                WHERE t.CUENTA_ID IN (${cuentaIdsList})
            `;
            
            const binds = {};
            
            if (fechaInicio && fechaFin) {
                const fechaInicioDate = new Date(fechaInicio);
                fechaInicioDate.setHours(0, 0, 0, 0);
                
                const fechaFinDate = new Date(fechaFin);
                fechaFinDate.setHours(23, 59, 59, 999);
                
                query += ` AND t.FECHA_TRANSACCION BETWEEN :fecha_inicio AND :fecha_fin`;
                binds.fecha_inicio = fechaInicioDate;
                binds.fecha_fin = fechaFinDate;
            }
            
            query += ` ORDER BY t.FECHA_TRANSACCION DESC`;
            
            const result = await connection.execute(query, Object.keys(binds).length > 0 ? binds : {});
            
            const transacciones = [];
            for (const row of result.rows) {
                transacciones.push({
                    transaccionId: row[0],
                    cuentaId: row[1],
                    tipoTransaccion: row[2],
                    monto: row[3],
                    fechaTransaccion: row[4]
                });
            }
            
            const message = transacciones.length === 0 
                ? "No se encontraron transacciones" 
                : `Se encontraron ${transacciones.length} transacción(es)`;
            
            response200(res, transacciones, message);
            
        } else {
            if (fechaInicio && fechaFin) {
                const fechaInicioDate = new Date(fechaInicio);
                fechaInicioDate.setHours(0, 0, 0, 0);
                
                const fechaFinDate = new Date(fechaFin);
                fechaFinDate.setHours(23, 59, 59, 999);
                
                const result = await connection.execute(
                    `BEGIN
                        gestion_transacciones_pkg.listar_todas_transacciones(
                            :p_fecha_inicio,
                            :p_fecha_fin,
                            :cursor
                        );
                    END;`,
                    {
                        p_fecha_inicio: fechaInicioDate,
                        p_fecha_fin: fechaFinDate,
                        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                    }
                );
                
                const resultSet = result.outBinds.cursor;
                
                const transacciones = [];
                let row;
                while ((row = await resultSet.getRow())) {
                    transacciones.push({
                        transaccionId: row[0],
                        cuentaId: row[1],
                        tipoTransaccion: row[2],
                        monto: row[3],
                        fechaTransaccion: row[4]
                    });
                }
                await resultSet.close();
                
                const message = transacciones.length === 0 
                    ? "No se encontraron transacciones en el rango de fechas especificado" 
                    : `Se encontraron ${transacciones.length} transacción(es)`;
                
                response200(res, transacciones, message);
            } else {
                const result = await connection.execute(
                    `BEGIN
                        gestion_transacciones_pkg.listar_todas_transacciones(:cursor);
                    END;`,
                    {
                        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                    }
                );
                
                const resultSet = result.outBinds.cursor;
                
                const transacciones = [];
                let row;
                while ((row = await resultSet.getRow())) {
                    transacciones.push({
                        transaccionId: row[0],
                        cuentaId: row[1],
                        tipoTransaccion: row[2],
                        monto: row[3],
                        fechaTransaccion: row[4]
                    });
                }
                await resultSet.close();
                
                const message = transacciones.length === 0 
                    ? "No se encontraron transacciones" 
                    : `Se encontraron ${transacciones.length} transacción(es)`;
                
                response200(res, transacciones, message);
            }
        }
        
    } catch (error) {
        if (error.errorNum) {
            const errorMessage = error.message || 'Error de base de datos';
            response500(res, `Error de base de datos: ${errorMessage}`);
            return;
        }
        
        const parsedMessage = parseOracleError(error);
        response500(res, parsedMessage || "Error al listar historial del usuario");
        
    } finally {
        await closeConnection(connection);
    }
};

