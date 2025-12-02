import { getClientById } from '../../services/client/getById.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const getClientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const clienteId = Number(id);
        
        if (isNaN(clienteId) || clienteId <= 0) {
            response400(res, 'ID de cliente inválido');
            return;
        }
        
        await getClientById(res, clienteId);
    } catch (error) {
        console.error('Error en getClientByIdController:', error);
        response500(res, 'Error al obtener el cliente');
    }
};

