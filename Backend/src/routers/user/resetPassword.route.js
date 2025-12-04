import { Router } from 'express';
import { resetPasswordController } from '../../controllers/user/resetPassword.controller.js';

const router = Router();
router.put('/resetear-password', resetPasswordController);

export default router;
