import { Router } from 'express';
import { searchClientByIdentificacionController } from '../../controllers/client/searchByIdentificacion.controller.js';

const router = Router();

router.get('/buscar/identificacion/:identificacion', searchClientByIdentificacionController);

export default router;

