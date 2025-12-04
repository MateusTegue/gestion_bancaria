import { searchUserByUsername } from '../../services/user/searchByUsername.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const searchUserByUsernameController = async (req, res) => {
    try {
        const { usuario } = req.query;
        
        if (!usuario) {
            response400(res, 'El parámetro usuario es requerido');
            return;
        }
        
        await searchUserByUsername(res, usuario);
    } catch (error) {
        response500(res, "Error al buscar usuario");
    }
};
