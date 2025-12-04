import { resetPassword } from '../../services/user/resetPassword.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const resetPasswordController = async (req, res) => {
    try {
        const { usuarioId, passwordNuevo, adminId } = req.body;
        
        if (!usuarioId || !passwordNuevo || !adminId) {
            response400(res, 'Los campos usuarioId, passwordNuevo y adminId son requeridos');
            return;
        }
        
        const resetData = {
            usuarioId: Number(usuarioId),
            passwordNuevo: passwordNuevo,
            adminId: Number(adminId)
        };
        
        await resetPassword(res, resetData);
    } catch (error) {
        response500(res, "Error al resetear contraseña");
    }
};
