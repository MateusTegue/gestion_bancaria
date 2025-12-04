import { Router } from 'express';
import { createUserController } from '../../controllers/user/create.controller.js';

const router = Router();
router.post('/', createUserController);

export default router;
