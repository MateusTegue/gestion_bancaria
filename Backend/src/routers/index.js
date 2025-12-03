import { Router } from 'express';
import listAllRoutes from './client/listAll.route.js';
import createRoutes from './client/create.route.js';
import getByIdRoutes from './client/getById.route.js';
import updateRoutes from './client/update.route.js';
import deleteRoutes from './client/delete.route.js';
import searchByIdentificacionRoutes from './client/searchByIdentificacion.route.js';

import createAccountRoutes from './account/create.route.js';
import listByClienteAccountRoutes from './account/listByCliente.route.js';
import changeEstadoAccountRoutes from './account/changeEstado.route.js';
import consultarSaldoAccountRoutes from './account/consultarSaldo.route.js';
import validarActivaAccountRoutes from './account/validarActiva.route.js';

import loginRoutes from './auth/login.route.js';

import realizarDepositoRoutes from './transaction/realizarDeposito.route.js';
import realizarRetiroRoutes from './transaction/realizarRetiro.route.js';
import realizarTransferenciaRoutes from './transaction/realizarTransferencia.route.js';
import generarHistorialRoutes from './transaction/generarHistorial.route.js';

const router = Router();

router.use('/api/clientes', listAllRoutes);
router.use('/api/clientes', createRoutes);
router.use('/api/clientes', getByIdRoutes);
router.use('/api/clientes', updateRoutes);
router.use('/api/clientes', deleteRoutes);
router.use('/api/clientes', searchByIdentificacionRoutes);

router.use('/api/cuentas', createAccountRoutes);
router.use('/api/cuentas', listByClienteAccountRoutes);
router.use('/api/cuentas', changeEstadoAccountRoutes);
router.use('/api/cuentas', consultarSaldoAccountRoutes);
router.use('/api/cuentas', validarActivaAccountRoutes);

router.use('/api/auth', loginRoutes);

router.use('/api/transacciones/deposito', realizarDepositoRoutes);
router.use('/api/transacciones/retiro', realizarRetiroRoutes);
router.use('/api/transacciones/transferencia', realizarTransferenciaRoutes);
router.use('/api/transacciones', generarHistorialRoutes);

export default router;