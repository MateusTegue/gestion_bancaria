// Mapeo de TIPO_PARAMETRO_ID a descripciones según TBL_TIPO_PARAMETROS
// En TBL_CUENTAS se almacenan los TIPO_PARAMETRO_ID directamente

export const ESTADO_CUENTA = {
  1: 'Activo',      // TIPO_PARAMETRO_ID 1, VALOR 7
  2: 'Inactivo',    // TIPO_PARAMETRO_ID 2, VALOR 5
  3: 'Bloqueado',   // TIPO_PARAMETRO_ID 3, VALOR 6
  8: 'Cancelado',   // TIPO_PARAMETRO_ID 8, VALOR 10
} as const;

export const TIPO_CUENTA = {
  4: 'Ahorro',      // TIPO_PARAMETRO_ID 4, VALOR 3
  5: 'Corriente',   // TIPO_PARAMETRO_ID 5, VALOR 4
} as const;

export const TIPO_TRANSACCION = {
  1: 'Ingreso',
  2: 'Retiro',
} as const;

export const getEstadoCuentaDescripcion = (estadoId: number | undefined | null): string => {
  if (estadoId === undefined || estadoId === null) return 'N/A';
  return ESTADO_CUENTA[estadoId as keyof typeof ESTADO_CUENTA] || `Estado ${estadoId}`;
};

export const getTipoCuentaDescripcion = (tipoCuentaId: number | undefined | null): string => {
  if (tipoCuentaId === undefined || tipoCuentaId === null) return '-';
  return TIPO_CUENTA[tipoCuentaId as keyof typeof TIPO_CUENTA] || `Tipo ${tipoCuentaId}`;
};

export const getTipoTransaccionDescripcion = (tipoTransaccionId: number | undefined | null): string => {
  if (tipoTransaccionId === undefined || tipoTransaccionId === null) return 'N/A';
  return TIPO_TRANSACCION[tipoTransaccionId as keyof typeof TIPO_TRANSACCION] || `Tipo ${tipoTransaccionId}`;
};

// Helper para obtener el valor numérico desde una descripción (para formularios)
export const getEstadoCuentaId = (descripcion: string): number | null => {
  const entry = Object.entries(ESTADO_CUENTA).find(([_, desc]) => desc === descripcion);
  return entry ? Number(entry[0]) : null;
};

export const getTipoCuentaId = (descripcion: string): number | null => {
  const entry = Object.entries(TIPO_CUENTA).find(([_, desc]) => desc === descripcion);
  return entry ? Number(entry[0]) : null;
};

