import { consultarSaldo } from '../../services/account/consultarSaldo.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const consultarSaldoController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cuentaId = Number(id);
        
        if (isNaN(cuentaId) || cuentaId <= 0) {
            response400(res, 'ID de cuenta inválido');
            return;
        }
        
        await consultarSaldo(res, cuentaId);
    } catch (error) {
        console.error('Error en consultarSaldoController:', error);
        response500(res, 'Error al consultar saldo');
    }
};

