import { Router } from 'express';
import listAllRoutes from './client/listAll.route.js';
import createRoutes from './client/create.route.js';
import getByIdRoutes from './client/getById.route.js';
import updateRoutes from './client/update.route.js';
import deleteRoutes from './client/delete.route.js';
import searchByIdentificacionRoutes from './client/searchByIdentificacion.route.js';

import createAccountRoutes from './account/create.route.js';
import listByClienteAccountRoutes from './account/listByCliente.route.js';
import listAllAccountRoutes from './account/listAll.route.js';
import changeEstadoAccountRoutes from './account/changeEstado.route.js';
import consultarSaldoAccountRoutes from './account/consultarSaldo.route.js';
import validarActivaAccountRoutes from './account/validarActiva.route.js';

import loginRoutes from './auth/login.route.js';

import createUserRoutes from './user/create.route.js';
import updateUserRoutes from './user/update.route.js';
import changePasswordRoutes from './user/changePassword.route.js';
import resetPasswordRoutes from './user/resetPassword.route.js';
import deleteUserRoutes from './user/delete.route.js';
import getUserByIdRoutes from './user/getById.route.js';
import listAllUsersRoutes from './user/listAll.route.js';
import listUsersByRoleRoutes from './user/listByRole.route.js';
import searchUserByUsernameRoutes from './user/searchByUsername.route.js';

import realizarDepositoRoutes from './transaction/realizarDeposito.route.js';
import realizarRetiroRoutes from './transaction/realizarRetiro.route.js';
import realizarTransferenciaRoutes from './transaction/realizarTransferencia.route.js';
import generarHistorialRoutes from './transaction/generarHistorial.route.js';
import listarHistorialUsuarioRoutes from './transaction/listarHistorialUsuario.route.js';

const router = Router();

router.use('/api/auth', loginRoutes);

router.use('/api/usuarios/buscar', searchUserByUsernameRoutes);
router.use('/api/usuarios/rol', listUsersByRoleRoutes);
router.use('/api/usuarios', createUserRoutes);
router.use('/api/usuarios', listAllUsersRoutes);
router.use('/api/usuarios', getUserByIdRoutes);
router.use('/api/usuarios', updateUserRoutes);
router.use('/api/usuarios', deleteUserRoutes);
router.use('/api/usuarios', changePasswordRoutes);
router.use('/api/usuarios', resetPasswordRoutes);

router.use('/api/clientes', listAllRoutes);
router.use('/api/clientes', createRoutes);
router.use('/api/clientes', getByIdRoutes);
router.use('/api/clientes', updateRoutes);
router.use('/api/clientes', deleteRoutes);
router.use('/api/clientes', searchByIdentificacionRoutes);

router.use('/api/cuentas', createAccountRoutes);
router.use('/api/cuentas', listByClienteAccountRoutes);
router.use('/api/cuentas', listAllAccountRoutes);
router.use('/api/cuentas', changeEstadoAccountRoutes);
router.use('/api/cuentas', consultarSaldoAccountRoutes);
router.use('/api/cuentas', validarActivaAccountRoutes);

router.use('/api/transacciones/deposito', realizarDepositoRoutes);
router.use('/api/transacciones/retiro', realizarRetiroRoutes);
router.use('/api/transacciones/transferencia', realizarTransferenciaRoutes);
router.use('/api/transacciones', generarHistorialRoutes);
router.use('/api/transacciones', listarHistorialUsuarioRoutes);

export default router;