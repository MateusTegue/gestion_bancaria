import { Router } from 'express';
import { searchUserByUsernameController } from '../../controllers/user/searchByUsername.controller.js';

const router = Router();
router.get('/buscar', searchUserByUsernameController);

export default router;
