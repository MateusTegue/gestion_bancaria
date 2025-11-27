import { Router } from 'express';
import { listAccountsByClienteController } from '../../controllers/account/listByCliente.controller.js';

const router = Router();

router.get('/cliente/:clienteId', listAccountsByClienteController);

export default router;

