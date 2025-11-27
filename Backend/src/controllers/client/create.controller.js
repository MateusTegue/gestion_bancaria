import { createClient } from '../../services/client/create.services.js';
import { response500 } from '../../utils/responses.js';

export const createClientController = async (req, res) => {
    try {
        const clientData = req.body;
        await createClient(res, clientData);
    } catch (error) {
        response500(res, "Error al crear cliente");
    }
};  