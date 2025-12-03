import { generarHistorial } from '../../services/transaction/generarHistorial.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const generarHistorialController = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaInicio, fechaFin } = req.query;
        
        if (!id) {
            response400(res, 'ID de cuenta es requerido');
            return;
        }
        
        if (!fechaInicio || !fechaFin) {
            response400(res, 'Fecha inicio y fecha fin son requeridas (formato: YYYY-MM-DD)');
            return;
        }
        
        // Validar formato de fechas
        const fechaInicioDate = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        
        if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
            response400(res, 'Formato de fecha inválido. Use YYYY-MM-DD');
            return;
        }
        
        if (fechaInicioDate > fechaFinDate) {
            response400(res, 'La fecha inicio debe ser anterior a la fecha fin');
            return;
        }
        
        await generarHistorial(res, id, fechaInicioDate, fechaFinDate);
    } catch (error) {
        console.error('Error en generarHistorialController:', error);
        response500(res, 'Error al generar historial');
    }
};

