import { getUserById } from '../../services/user/getById.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const getUserByIdController = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        if (!usuarioId) {
            response400(res, 'El campo usuarioId es requerido');
            return;
        }
        
        await getUserById(res, Number(usuarioId));
    } catch (error) {
        response500(res, "Error al consultar usuario");
    }
};
