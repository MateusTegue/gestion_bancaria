import { changeAccountEstado } from '../../services/account/changeEstado.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const changeAccountEstadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, estadoId, usuarioId } = req.body;
        
        const cuentaId = Number(id);
        
        if (isNaN(cuentaId) || cuentaId <= 0) {
            response400(res, 'ID de cuenta inválido');
            return;
        }
        
        let finalEstadoId = estadoId;
        if (estado && !estadoId) {
            finalEstadoId = estado === 'ACTIVA' ? 1 : estado === 'INACTIVA' ? 2 : null;
        }
        
        const finalUsuarioId = usuarioId || 1;
        
        await changeAccountEstado(res, cuentaId, finalEstadoId, finalUsuarioId);
    } catch (error) {
        console.error('Error en changeAccountEstadoController:', error);
        response500(res, 'Error al cambiar estado de cuenta');
    }
};

