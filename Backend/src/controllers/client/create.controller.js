import { createClient } from '../../services/client/create.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const createClientController = async (req, res) => {
    try {
        const { identificacion, primerNombre, segundoNombre, primerApellido, segundoApellido, direccion } = req.body;
        
        if (!identificacion || !primerNombre || !primerApellido) {
            response400(res, 'Los campos identificacion, primerNombre y primerApellido son requeridos');
            return;
        }
        
        const clientData = {
            clienteId: Number(identificacion) || null,
            primerNombre: primerNombre,
            segundoNombre: segundoNombre || null,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido || null,
            identificacion: identificacion,
            direccion: direccion || null
        };
        
        await createClient(res, clientData);
    } catch (error) {
        response500(res, "Error al crear cliente");
    }
};  