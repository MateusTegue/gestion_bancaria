import { listAllUsers } from '../../services/user/listAll.services.js';
import { response500 } from '../../utils/responses.js';

export const listAllUsersController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        await listAllUsers(res, page, limit);
    } catch (error) {
        response500(res, "Error al listar usuarios");
    }
};
