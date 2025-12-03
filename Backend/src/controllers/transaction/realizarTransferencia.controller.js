import { realizarTransferencia } from '../../services/transaction/realizarTransferencia.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const realizarTransferenciaController = async (req, res) => {
    try {
        const { cuentaOrigen, cuentaDestino, monto, usuarioId } = req.body;
        
        if (!cuentaOrigen) {
            response400(res, 'ID de cuenta origen es requerido');
            return;
        }
        
        if (!cuentaDestino) {
            response400(res, 'ID de cuenta destino es requerido');
            return;
        }
        
        if (cuentaOrigen === cuentaDestino) {
            response400(res, 'La cuenta origen y destino no pueden ser la misma');
            return;
        }
        
        if (!monto || monto <= 0) {
            response400(res, 'El monto debe ser mayor a 0');
            return;
        }
        
        if (!usuarioId) {
            response400(res, 'ID de usuario es requerido');
            return;
        }
        
        await realizarTransferencia(res, cuentaOrigen, cuentaDestino, monto, usuarioId);
    } catch (error) {
        console.error('Error en realizarTransferenciaController:', error);
        response500(res, 'Error al realizar transferencia');
    }
};

