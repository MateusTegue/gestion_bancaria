export const closeConnection = async (connection) => {
    if (connection) {
        try {
            await connection.close();
        } catch (closeError) {
            console.error('Error al cerrar la conexión:', closeError);
        }
    }
};

