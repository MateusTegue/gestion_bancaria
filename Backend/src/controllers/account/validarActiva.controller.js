import { validarCuentaActiva } from '../../services/account/validarActiva.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const validarCuentaActivaController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cuentaId = Number(id);
        
        if (isNaN(cuentaId) || cuentaId <= 0) {
            response400(res, 'ID de cuenta inválido');
            return;
        }
        
        await validarCuentaActiva(res, cuentaId);
    } catch (error) {
        response500(res, 'Error al validar cuenta activa');
    }
};

