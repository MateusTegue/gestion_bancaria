import { changePassword } from '../../services/user/changePassword.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const changePasswordController = async (req, res) => {
    try {
        const { usuarioId, passwordActual, passwordNuevo } = req.body;
        
        if (!usuarioId || !passwordActual || !passwordNuevo) {
            response400(res, 'Los campos usuarioId, passwordActual y passwordNuevo son requeridos');
            return;
        }
        
        const passwordData = {
            usuarioId: Number(usuarioId),
            passwordActual: passwordActual,
            passwordNuevo: passwordNuevo
        };
        
        await changePassword(res, passwordData);
    } catch (error) {
        response500(res, "Error al cambiar contraseña");
    }
};
