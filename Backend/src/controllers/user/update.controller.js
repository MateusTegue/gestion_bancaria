import { updateUser } from '../../services/user/update.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const updateUserController = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { rolId, clienteId, usuario } = req.body;
        
        if (!usuarioId || !rolId || !usuario) {
            response400(res, 'Los campos usuarioId, rolId y usuario son requeridos');
            return;
        }
        
        const userData = {
            usuarioId: Number(usuarioId),
            rolId: Number(rolId),
            clienteId: clienteId || null,
            usuario: usuario
        };
        
        await updateUser(res, userData);
    } catch (error) {
        response500(res, "Error al actualizar usuario");
    }
};
