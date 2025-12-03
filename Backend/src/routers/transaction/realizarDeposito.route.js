import { Router } from 'express';
import { realizarDepositoController } from '../../controllers/transaction/realizarDeposito.controller.js';

const router = Router();

router.post('/', realizarDepositoController);

export default router;

