// Mapeo de TIPO_PARAMETRO_ID a descripciones según TBL_TIPO_PARAMETROS
// En TBL_CUENTAS se almacenan los TIPO_PARAMETRO_ID directamente

const ESTADO_CUENTA = {
  1: 'Activo',      // TIPO_PARAMETRO_ID 1, VALOR 7
  2: 'Inactivo',    // TIPO_PARAMETRO_ID 2, VALOR 5
  3: 'Bloqueado',   // TIPO_PARAMETRO_ID 3, VALOR 6
  8: 'Cancelado',   // TIPO_PARAMETRO_ID 8, VALOR 10
};

const TIPO_CUENTA = {
  4: 'Ahorro',      // TIPO_PARAMETRO_ID 4, VALOR 3
  5: 'Corriente',   // TIPO_PARAMETRO_ID 5, VALOR 4
};

const TIPO_TRANSACCION = {
  1: 'Ingreso',
  2: 'Retiro',
};

export const getEstadoCuentaDescripcion = (estadoId) => {
  if (estadoId === undefined || estadoId === null) return 'N/A';
  return ESTADO_CUENTA[estadoId] || `Estado ${estadoId}`;
};

export const getTipoCuentaDescripcion = (tipoCuentaId) => {
  if (tipoCuentaId === undefined || tipoCuentaId === null) return null;
  return TIPO_CUENTA[tipoCuentaId] || `Tipo ${tipoCuentaId}`;
};

export const getTipoTransaccionDescripcion = (tipoTransaccionId) => {
  if (tipoTransaccionId === undefined || tipoTransaccionId === null) return 'N/A';
  return TIPO_TRANSACCION[tipoTransaccionId] || `Tipo ${tipoTransaccionId}`;
};

// Helper para obtener el valor numérico desde una descripción
export const getEstadoCuentaId = (descripcion) => {
  const entry = Object.entries(ESTADO_CUENTA).find(([_, desc]) => desc === descripcion);
  return entry ? Number(entry[0]) : null;
};

export const getTipoCuentaId = (descripcion) => {
  const entry = Object.entries(TIPO_CUENTA).find(([_, desc]) => desc === descripcion);
  return entry ? Number(entry[0]) : null;
};

