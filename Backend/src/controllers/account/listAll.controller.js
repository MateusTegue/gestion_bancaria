import { listAllAccounts } from '../../services/account/listAll.services.js';
import { response500 } from '../../utils/responses.js';

export const listAllAccountsController = async (req, res) => {
    try {
        await listAllAccounts(res);
    } catch (error) {
        response500(res, 'Error al listar todas las cuentas');
    }
};

