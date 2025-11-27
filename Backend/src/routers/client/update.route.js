import { Router } from 'express';
import { updateClientController } from '../../controllers/client/update.controller.js';

const router = Router();

router.put('/:id', updateClientController);
router.patch('/:id', updateClientController);

export default router;

