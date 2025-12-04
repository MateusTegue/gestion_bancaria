import { Router } from 'express';
import { realizarRetiroController } from '../../controllers/transaction/realizarRetiro.controller.js';

const router = Router();

router.post('/', realizarRetiroController);

export default router;

