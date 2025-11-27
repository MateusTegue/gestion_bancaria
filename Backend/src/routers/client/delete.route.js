import { Router } from 'express';
import { deleteClientController } from '../../controllers/client/delete.controller.js';

const router = Router();

router.delete('/:id', deleteClientController);

export default router;

