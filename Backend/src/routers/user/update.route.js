import { Router } from 'express';
import { updateUserController } from '../../controllers/user/update.controller.js';

const router = Router();
router.put('/:usuarioId', updateUserController);

export default router;
