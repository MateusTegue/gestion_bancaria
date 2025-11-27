import { listAccountsByCliente } from '../../services/account/listByCliente.services.js';
import { response500 } from '../../utils/responses.js';

export const listAccountsByClienteController = async (req, res) => {
    try {
        const { clienteId } = req.params;
        await listAccountsByCliente(res, clienteId);
    } catch (error) {
        console.error('Error en listAccountsByClienteController:', error);
        response500(res, 'Error al listar cuentas del cliente');
    }
};

