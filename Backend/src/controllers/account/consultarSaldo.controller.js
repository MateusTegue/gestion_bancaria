import { consultarSaldo } from '../../services/account/consultarSaldo.services.js';
import { response500 } from '../../utils/responses.js';

export const consultarSaldoController = async (req, res) => {
    try {
        const { id } = req.params;
        await consultarSaldo(res, id);
    } catch (error) {
        console.error('Error en consultarSaldoController:', error);
        response500(res, 'Error al consultar saldo');
    }
};

