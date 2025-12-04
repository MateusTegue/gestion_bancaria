import { listAllUsers } from '../../services/user/listAll.services.js';
import { response500 } from '../../utils/responses.js';

export const listAllUsersController = async (req, res) => {
    try {
        await listAllUsers(res);
    } catch (error) {
        response500(res, "Error al listar usuarios");
    }
};
