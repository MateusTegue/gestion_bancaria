import { createUser } from '../../services/user/create.services.js';
import { response400, response500 } from '../../utils/responses.js';

export const createUserController = async (req, res) => {
    try {
        const { rolId, clienteId, usuario, password } = req.body;
        
        if (!rolId || !usuario || !password) {
            response400(res, 'Los campos rolId, usuario y password son requeridos');
            return;
        }
        
        const userData = {
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
