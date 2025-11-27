import { changeAccountEstado } from '../../services/account/changeEstado.services.js';
import { response500 } from '../../utils/responses.js';

export const changeAccountEstadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estadoId, usuarioId } = req.body;
        await changeAccountEstado(res, id, estadoId, usuarioId);
    } catch (error) {
        console.error('Error en changeAccountEstadoController:', error);
        response500(res, 'Error al cambiar estado de cuenta');
    }
};

