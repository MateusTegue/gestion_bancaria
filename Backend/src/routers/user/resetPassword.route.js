import { Router } from 'express';
import { resetPasswordController } from '../../controllers/user/resetPassword.controller.js';

const router = Router();
router.put('/', resetPasswordController);

export default router;
