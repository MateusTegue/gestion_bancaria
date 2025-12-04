import { listUsersByRole } from '../../services/user/listByRole.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const listUsersByRoleController = async (req, res) => {
    try {
        const { rolId } = req.params;
        
        if (!rolId) {
            response400(res, 'El campo rolId es requerido');
            return;
        }
        
        await listUsersByRole(res, Number(rolId));
    } catch (error) {
        response500(res, "Error al listar usuarios por rol");
    }
};
