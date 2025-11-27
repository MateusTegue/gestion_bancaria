import { updateClient } from '../../services/client/update.services.js';
import { response500 } from '../../utils/responses.js';

export const updateClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body;
        await updateClient(res, id, clientData);
    } catch (error) {
        console.error('Error en updateClientController:', error);
        response500(res, 'Error al actualizar el cliente');
    }
};

