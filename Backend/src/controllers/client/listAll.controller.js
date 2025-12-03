import { listAllClients } from '../../services/client/listAll.services.js';
import { response500 } from '../../utils/responses.js';

export const listAllClientsController = async (req, res) => {
    try {
        await listAllClients(res);
    } catch (error) {
        response500(res, 'Error al listar todos los clientes');
    }
};