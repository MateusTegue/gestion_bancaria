import { changeAccountEstado } from '../../services/account/changeEstado.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const changeAccountEstadoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, estadoId, usuarioId } = req.body;
        
        if (!id || (typeof id === 'string' && id.trim() === '')) {
            response400(res, 'ID de cuenta es requerido');
            return;
        }
        
        // El cuentaId puede ser un string (ej: "CUENTA_0001") o un número
        let finalEstadoId = estadoId;
        if (estado && !estadoId) {
            finalEstadoId = estado === 'ACTIVA' ? 1 : estado === 'INACTIVA' ? 2 : null;
        }
        
        if (!finalEstadoId) {
            response400(res, 'Estado ID es requerido');
            return;
        }
        
        const finalUsuarioId = usuarioId || 1;
        
        await changeAccountEstado(res, id, finalEstadoId, finalUsuarioId);
    } catch (error) {
        console.error('Error en changeAccountEstadoController:', error);
        response500(res, 'Error al cambiar estado de cuenta');
    }
};

