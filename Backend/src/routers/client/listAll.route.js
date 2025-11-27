import { Router } from 'express';
import { listAllClientsController } from '../../controllers/client/listAll.controller.js';

const router = Router();

router.get('/', listAllClientsController);

export default router;