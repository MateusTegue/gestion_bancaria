import { Router } from 'express';
import { realizarTransferenciaController } from '../../controllers/transaction/realizarTransferencia.controller.js';

const router = Router();

router.post('/', realizarTransferenciaController);

export default router;

