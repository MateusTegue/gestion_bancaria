import { validarCredenciales } from '../../services/auth/validarCredenciales.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const validarCredencialesController = async (req, res) => {
    try {
        const { usuario, password } = req.body;
        
        if (!usuario || !password) {
            response400(res, 'Usuario y contraseña son requeridos');
            return;
        }
        
        await validarCredenciales(res, usuario, password);
    } catch (error) {
        response500(res, 'Error al validar credenciales');
    }
};

