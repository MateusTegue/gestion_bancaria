import { getClientById } from '../../services/client/getById.services.js';
import { response500 } from '../../utils/responses.js';

export const getClientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        await getClientById(res, id);
    } catch (error) {
        console.error('Error en getClientByIdController:', error);
        response500(res, 'Error al obtener el cliente');
    }
};

