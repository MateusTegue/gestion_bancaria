import { Router } from 'express';
import { listUsersByRoleController } from '../../controllers/user/listByRole.controller.js';

const router = Router();
router.get('/rol/:rolId', listUsersByRoleController);

export default router;
