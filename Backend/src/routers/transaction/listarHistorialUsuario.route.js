import { Router } from 'express';
import { listarHistorialUsuarioController } from '../../controllers/transaction/listarHistorialUsuario.controller.js';

const router = Router();

router.post('/historial-usuario', listarHistorialUsuarioController);

export default router;

