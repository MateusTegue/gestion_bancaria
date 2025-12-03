export interface Cliente {
  id?: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  direccion?: string;
}

export interface ClienteBackend {
  clienteId?: string | number;
  nombre?: string;
  identificacion?: string | number;
  direccion?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombreCompleto?: string;
  totalCuentas?: number;
  saldoTotal?: number;
}

export interface ClienteFormData {
  identificacion: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  direccion: string;
}

export interface Cuenta {
  id?: number;
  clienteId: number;
  numeroCuenta: string;
  tipoCuenta?: string;
  saldo: number;
  estado?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Usuario {
  usuarioId: number;
  usuario: string;
  rolId: number;
}

export interface DepositoData {
  cuentaId: string;
  monto: number;
  saldoActualizado: number;
  fecha: string;
}

export interface RetiroData {
  cuentaId: string;
  monto: number;
  saldoActualizado: number;
  fecha: string;
}

export interface TransferenciaData {
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  saldoOrigen: number;
  saldoDestino: number;
  fecha: string;
}

export interface HistorialTransaccion {
  transaccionId: number;
  cuentaId: string;
  tipoTransaccion: string;
  monto: number;
  fechaTransaccion: string;
}

