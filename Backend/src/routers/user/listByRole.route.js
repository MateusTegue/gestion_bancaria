import { Router } from 'express';
import { listUsersByRoleController } from '../../controllers/user/listByRole.controller.js';

const router = Router();
router.get('/:rolId', listUsersByRoleController);

export default router;
