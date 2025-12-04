import { Router } from 'express';
import { listAllUsersController } from '../../controllers/user/listAll.controller.js';

const router = Router();
router.get('/', listAllUsersController);

export default router;
