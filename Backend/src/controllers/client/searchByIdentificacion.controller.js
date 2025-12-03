import { searchClientByIdentificacion } from '../../services/client/searchByIdentificacion.services.js';
import { response500 } from '../../utils/responses.js';

export const searchClientByIdentificacionController = async (req, res) => {
    try {
        const { identificacion } = req.params;
        await searchClientByIdentificacion(res, identificacion);
    } catch (error) {
        response500(res, 'Error al buscar el cliente');
    }
};

