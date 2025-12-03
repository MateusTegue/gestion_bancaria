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

