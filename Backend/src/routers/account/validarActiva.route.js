import { Router } from 'express';
import { validarCuentaActivaController } from '../../controllers/account/validarActiva.controller.js';

const router = Router();

router.get('/:id/Activo', validarCuentaActivaController);

export default router;

