import { createAccount } from '../../services/account/create.services.js';
import { response500 } from '../../utils/responses.js';

export const createAccountController = async (req, res) => {
    try {
        const accountData = req.body;
        await createAccount(res, accountData);
    } catch (error) {
        response500(res, 'Error al crear cuenta');
    }
};

