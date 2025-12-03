import { listarHistorialUsuario } from '../../services/transaction/listarHistorialUsuario.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const listarHistorialUsuarioController = async (req, res) => {
    try {
        const { usuarioId } = req.body;
        const { fechaInicio, fechaFin } = req.query;
        
        if (!usuarioId) {
            response400(res, 'ID de usuario es requerido');
            return;
        }
        
        if (fechaInicio && fechaFin) {
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
            
            if (isNaN(fechaInicioDate.getTime())) {
                response400(res, 'Fecha de inicio inválida');
                return;
            }
            
            if (isNaN(fechaFinDate.getTime())) {
                response400(res, 'Fecha fin inválida');
                return;
            }
            
            if (fechaInicioDate > fechaFinDate) {
                response400(res, 'La fecha de inicio no puede ser mayor a la fecha fin');
                return;
            }
        }
        
        await listarHistorialUsuario(res, usuarioId, fechaInicio || null, fechaFin || null);
    } catch (error) {
        response500(res, 'Error al listar historial del usuario');
    }
};

