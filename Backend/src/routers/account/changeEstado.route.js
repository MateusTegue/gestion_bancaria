import { Router } from 'express';
import { changeAccountEstadoController } from '../../controllers/account/changeEstado.controller.js';

const router = Router();

router.patch('/:id/estado', changeAccountEstadoController);
router.put('/:id/estado', changeAccountEstadoController);

export default router;

