import { Router } from 'express';
import { getClientByIdController } from '../../controllers/client/getById.controller.js';

const router = Router();

router.get('/:id', getClientByIdController);

export default router;

