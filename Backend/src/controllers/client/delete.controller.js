import { deleteClient } from '../../services/client/delete.services.js';
import { response500 } from '../../utils/responses.js';

export const deleteClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;
        await deleteClient(res, id, usuarioId);
    } catch (error) {
        console.error('Error en deleteClientController:', error);
        response500(res, 'Error al eliminar el cliente');
    }
};

