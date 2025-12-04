import { Router } from 'express';
import { changePasswordController } from '../../controllers/user/changePassword.controller.js';

const router = Router();
router.put('/cambiar-password', changePasswordController);

export default router;
