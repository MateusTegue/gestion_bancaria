import { deleteUser } from '../../services/user/delete.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const deleteUserController = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { adminId } = req.body;
        
        if (!usuarioId || !adminId) {
            response400(res, 'Los campos usuarioId y adminId son requeridos');
            return;
        }
        
        await deleteUser(res, Number(usuarioId), Number(adminId));
    } catch (error) {
        response500(res, "Error al eliminar usuario");
    }
};
