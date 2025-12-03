import { listAccountsByCliente } from '../../services/account/listByCliente.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const listAccountsByClienteController = async (req, res) => {
    try {
        const { clienteId } = req.params;
        
        const clienteIdNum = Number(clienteId);
        
        if (isNaN(clienteIdNum) || clienteIdNum <= 0) {
            response400(res, 'ID de cliente inválido');
            return;
        }
        
        await listAccountsByCliente(res, clienteIdNum);
    } catch (error) {
        response500(res, 'Error al listar cuentas del cliente');
    }
};

