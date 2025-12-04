import { createUser } from '../../services/user/create.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const createUserController = async (req, res) => {
    try {
        const { usuarioId, rolId, clienteId, usuario, password } = req.body;
        
        if (!usuarioId || !rolId || !usuario || !password) {
            response400(res, 'Los campos usuarioId, rolId, usuario y password son requeridos');
            return;
        }
        
        const userData = {
            usuarioId: Number(usuarioId),
            rolId: Number(rolId),
            clienteId: clienteId || null,
            usuario: usuario,
            password: password
        };
        
        await createUser(res, userData);
    } catch (error) {
        response500(res, "Error al crear usuario");
    }
};
