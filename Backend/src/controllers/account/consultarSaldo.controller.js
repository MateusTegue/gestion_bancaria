import { consultarSaldo } from '../../services/account/consultarSaldo.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const consultarSaldoController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || (typeof id === 'string' && id.trim() === '')) {
            response400(res, 'ID de cuenta es requerido');
            return;
        }
        
        await consultarSaldo(res, id);
    } catch (error) {
        response500(res, 'Error al consultar saldo');
    }
};

