import { Router } from 'express';
import { createClientController } from '../../controllers/client/create.controller.js';

const router = Router();
router.post('/', createClientController);

export default router;