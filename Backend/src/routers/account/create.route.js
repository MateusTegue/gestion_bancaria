import { Router } from 'express';
import { createAccountController } from '../../controllers/account/create.controller.js';

const router = Router();

router.post('/', createAccountController);

export default router;

