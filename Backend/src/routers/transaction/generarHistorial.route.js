import { Router } from 'express';
import { generarHistorialController } from '../../controllers/transaction/generarHistorial.controller.js';

const router = Router();

router.get('/:id/historial', generarHistorialController);

export default router;

