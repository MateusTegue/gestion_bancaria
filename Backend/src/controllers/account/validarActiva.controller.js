import { validarCuentaActiva } from '../../services/account/validarActiva.services.js';
import { response500 } from '../../utils/responses.js';

export const validarCuentaActivaController = async (req, res) => {
    try {
        const { id } = req.params;
        await validarCuentaActiva(res, id);
    } catch (error) {
        console.error('Error en validarCuentaActivaController:', error);
        response500(res, 'Error al validar cuenta activa');
    }
};

