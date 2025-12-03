import { updateClient } from '../../services/client/update.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const updateClientController = async (req, res) => {
    try {
        const { id } = req.params;
        const { primerNombre, segundoNombre, primerApellido, segundoApellido, direccion } = req.body;
        
        const clienteId = Number(id);
        
        if (isNaN(clienteId) || clienteId <= 0) {
            response400(res, 'ID de cliente inválido');
            return;
        }
        
        const clientData = {
            primerNombre: primerNombre || '',
            segundoNombre: segundoNombre || null,
            primerApellido: primerApellido || '',
            segundoApellido: segundoApellido || null,
            direccion: direccion || null
        };
        
        await updateClient(res, clienteId, clientData);
    } catch (error) {
        console.error('Error en updateClientController:', error);
        response500(res, 'Error al actualizar el cliente');
    }
};

