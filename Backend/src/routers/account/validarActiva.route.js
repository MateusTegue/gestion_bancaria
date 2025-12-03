import { Router } from 'express';
import { validarCuentaActivaController } from '../../controllers/account/validarActiva.controller.js';

const router = Router();

router.get('/:id/validar', validarCuentaActivaController);
router.get('/:id/Activo', validarCuentaActivaController); // Mantener compatibilidad

export default router;

