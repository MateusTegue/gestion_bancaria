import { Router } from 'express';
import { deleteUserController } from '../../controllers/user/delete.controller.js';

const router = Router();
router.delete('/:usuarioId', deleteUserController);

export default router;
