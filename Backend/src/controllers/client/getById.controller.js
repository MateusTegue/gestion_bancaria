import { getClientById } from '../../services/client/getById.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const getClientByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || (typeof id === 'string' && id.trim() === '')) {
            response400(res, 'ID de cliente es requerido');
            return;
        }
        
        const clienteId = Number(id);
        
        if (isNaN(clienteId)) {
            response400(res, `ID de cliente inválido: "${id}". Debe ser un número válido.`);
            return;
        }
        
        if (!Number.isInteger(clienteId)) {
            response400(res, 'ID de cliente debe ser un número entero');
            return;
        }
        
        if (clienteId <= 0) {
            response400(res, 'ID de cliente debe ser mayor a 0');
            return;
        }
        
        if (clienteId > Number.MAX_SAFE_INTEGER) {
            response400(res, 'ID de cliente es demasiado grande');
            return;
        }
        
        await getClientById(res, clienteId);
    } catch (error) {
        response500(res, 'Error al obtener el cliente');
    }
};

