import { changeAccountEstado } from '../../services/account/changeEstado.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const changeAccountEstadoController = async (req, res) => {
    try {
        console.log('=== changeAccountEstadoController - Inicio ===');
        console.log('req.params:', req.params);
        console.log('req.body:', req.body);
        
        const { id } = req.params;
        const { estado, estadoId, usuarioId } = req.body;
        
        console.log('Valores extraídos:');
        console.log('id:', id);
        console.log('estado:', estado);
        console.log('estadoId:', estadoId);
        console.log('usuarioId:', usuarioId);
        
        if (!id || (typeof id === 'string' && id.trim() === '')) {
            console.log('Error: ID de cuenta es requerido');
            response400(res, 'ID de cuenta es requerido');
            return;
        }
        
        let finalEstadoId = estadoId;
        if (estado && !estadoId) {
            finalEstadoId = estado === 'ACTIVA' ? 1 : estado === 'INACTIVA' ? 2 : null;
            console.log('Estado calculado desde estado string:', finalEstadoId);
        }
        
        if (!finalEstadoId) {
            console.log('Error: Estado ID es requerido');
            response400(res, 'Estado ID es requerido');
            return;
        }
        
        const finalUsuarioId = usuarioId || 1;
        console.log('Valores finales:');
        console.log('finalEstadoId:', finalEstadoId);
        console.log('finalUsuarioId:', finalUsuarioId);
        
        await changeAccountEstado(res, id, finalEstadoId, finalUsuarioId);
        console.log('=== changeAccountEstadoController - Fin exitoso ===');
    } catch (error) {
        console.log('=== ERROR en changeAccountEstadoController ===');
        console.log('Error:', error);
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        response500(res, 'Error al cambiar estado de cuenta');
    }
};

