import { Router } from 'express';
import { getUserByIdController } from '../../controllers/user/getById.controller.js';

const router = Router();
router.get('/:usuarioId', getUserByIdController);

export default router;
