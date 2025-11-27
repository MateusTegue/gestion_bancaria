/**
 * Utilidad para cerrar conexiones de Oracle de forma segura
 * @param {Object} connection - Objeto de conexión de Oracle
 * @returns {Promise<void>}
 */
export const closeConnection = async (connection) => {
    if (connection) {
        try {
            await connection.close();
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    }
};

