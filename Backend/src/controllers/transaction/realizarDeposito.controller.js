import { realizarDeposito } from '../../services/transaction/realizarDeposito.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const realizarDepositoController = async (req, res) => {
    try {
        const { cuentaId, monto, usuarioId } = req.body;
        
        if (!cuentaId) {
            response400(res, 'ID de cuenta es requerido');
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
        
        await realizarDeposito(res, cuentaId, monto, usuarioId);
    } catch (error) {
        response500(res, 'Error al realizar depósito');
    }
};

