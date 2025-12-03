export const closeConnection = async (connection) => {
    if (connection) {
        try {
            await connection.close();
        } catch (closeError) {
        }
    }
};

