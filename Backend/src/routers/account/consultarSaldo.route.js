import { Router } from 'express';
import { consultarSaldoController } from '../../controllers/account/consultarSaldo.controller.js';

const router = Router();

router.get('/:id/saldo', consultarSaldoController);

export default router;

