import { Router } from 'express';
import { listAllAccountsController } from '../../controllers/account/listAll.controller.js';

const router = Router();

router.get('/', listAllAccountsController);

export default router;

