import { Router } from 'express';
import { validarCredencialesController } from '../../controllers/auth/validarCredenciales.controller.js';

const router = Router();

router.post('/', validarCredencialesController);

export default router;

