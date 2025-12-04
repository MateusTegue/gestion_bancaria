create or replace NONEDITIONABLE PACKAGE            GESTION_TRANSACCIONES_PKG IS

  -- Constantes públicas (para claridad)
  c_tipo_ingreso CONSTANT NUMBER := 6; -- TIPO_PARAMETRO_ID para 'Ingreso'
  c_tipo_retiro  CONSTANT NUMBER := 7; -- TIPO_PARAMETRO_ID para 'Retiro'
  c_estado_activo CONSTANT NUMBER := 1; -- TIPO_PARAMETRO_ID para 'Activo'

  -- Procedimientos
  PROCEDURE realizar_deposito(
    p_cuenta_id IN VARCHAR2,
    p_monto     IN NUMBER,
    p_usuario_id IN NUMBER
  );

  PROCEDURE realizar_retiro(
    p_cuenta_id IN VARCHAR2,
    p_monto     IN NUMBER,
    p_usuario_id IN NUMBER
  );

  PROCEDURE realizar_transferencia(
    p_cuenta_origen IN VARCHAR2,
    p_cuenta_destino IN VARCHAR2,
    p_monto IN NUMBER,
    p_usuario_id IN NUMBER
  );

  -- Función que devuelve un ref cursor con el historial de una cuenta
  FUNCTION generar_historial(
    p_cuenta_id IN VARCHAR2,
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE
  ) RETURN SYS_REFCURSOR;

  -- Procedimiento para listar el historial de todas las transacciones
  PROCEDURE listar_todas_transacciones(
    p_cursor OUT SYS_REFCURSOR
  );

  -- Procedimiento para listar todas las transacciones con filtro de fechas
  PROCEDURE listar_todas_transacciones(
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE,
    p_cursor OUT SYS_REFCURSOR
  );

END GESTION_TRANSACCIONES_PKG;


create or replace NONEDITIONABLE PACKAGE BODY            GESTION_TRANSACCIONES_PKG AS

  ----------------------------------------------------------------------------
  -- UTIL: Obtener saldo y validar existencia/estado
  ----------------------------------------------------------------------------
  FUNCTION f_get_saldo_validar(p_cuenta_id VARCHAR2) RETURN NUMBER IS
    v_saldo PROYECTODB.TBL_CUENTAS.SALDO%TYPE;
  BEGIN
    SELECT SALDO
      INTO v_saldo
      FROM PROYECTODB.TBL_CUENTAS
     WHERE CUENTA_ID = p_cuenta_id
       AND ESTADO_ID = c_estado_activo; -- solo si está activo

    RETURN v_saldo;

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      -- Cuenta no existe o no está activa
      RAISE_APPLICATION_ERROR(-20001, 'Cuenta inexistente o no activa: ' || p_cuenta_id);
  END f_get_saldo_validar;


  ----------------------------------------------------------------------------
  -- PROCEDURE: realizar_deposito
  ----------------------------------------------------------------------------
  PROCEDURE realizar_deposito(
    p_cuenta_id IN VARCHAR2,
    p_monto     IN NUMBER,
    p_usuario_id IN NUMBER
  ) IS
    v_trans_id NUMBER;
  BEGIN
    IF p_monto <= 0 THEN
      RAISE_APPLICATION_ERROR(-20010, 'El monto debe ser mayor a 0');
    END IF;

    -- valida existencia y estado (lanzará excepción si no existe/activo)
    DECLARE
      v_dummy NUMBER := f_get_saldo_validar(p_cuenta_id);
    BEGIN
      NULL;
    END;

    -- generar id transaccion
    v_trans_id := PROYECTODB.SEQ_TRANSACCION_ID.NEXTVAL;

    -- registrar transaccion (Tipo = ingreso => c_tipo_ingreso)
    INSERT INTO PROYECTODB.TBL_TRANSACCIONES (
      TRANSACCION_ID, CUENTA_ID, TIPO_TRANSACCION_ID, MONTO, FECHA_TRANSACCION
    ) VALUES (
      v_trans_id, p_cuenta_id, c_tipo_ingreso, p_monto, SYSDATE
    );

    -- actualizar saldo
    UPDATE PROYECTODB.TBL_CUENTAS
    SET SALDO = NVL(SALDO,0) + p_monto
    WHERE CUENTA_ID = p_cuenta_id;


    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE; -- dejar que el caller vea el error (o podrías normalizarlo)
  END realizar_deposito;


  ----------------------------------------------------------------------------
  -- PROCEDURE: realizar_retiro
  ----------------------------------------------------------------------------
  PROCEDURE realizar_retiro(
    p_cuenta_id IN VARCHAR2,
    p_monto     IN NUMBER,
    p_usuario_id IN NUMBER
  ) IS
    v_trans_id NUMBER;
    v_saldo_actual NUMBER;
  BEGIN
    IF p_monto <= 0 THEN
      RAISE_APPLICATION_ERROR(-20011, 'El monto debe ser mayor a 0');
    END IF;

    -- validar existencia y estado
    v_saldo_actual := f_get_saldo_validar(p_cuenta_id); -- puede lanzar -20001

    -- verificar fondos suficientes (validación estricta)
    IF v_saldo_actual < p_monto THEN
      RAISE_APPLICATION_ERROR(-20002, 'Fondos insuficientes en la cuenta ' || p_cuenta_id);
    END IF;

    -- crear transaccion
    v_trans_id := PROYECTODB.SEQ_TRANSACCION_ID.NEXTVAL;
    INSERT INTO PROYECTODB.TBL_TRANSACCIONES (
      TRANSACCION_ID, CUENTA_ID, TIPO_TRANSACCION_ID, MONTO, FECHA_TRANSACCION
    ) VALUES (
      v_trans_id, p_cuenta_id, c_tipo_retiro, p_monto, SYSDATE
    );

    -- actualizar saldo
    UPDATE PROYECTODB.TBL_CUENTAS
    SET SALDO = SALDO - p_monto
    WHERE CUENTA_ID = p_cuenta_id;

    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RAISE;
  END realizar_retiro;


  ----------------------------------------------------------------------------
  -- PROCEDURE: realizar_transferencia
  -- Implementado como: 1) validar origen/destino 2) retirar del origen 3) depositar en destino
  -- Todo en la misma transacción (si falla algo, todo ROLLBACK)
  ----------------------------------------------------------------------------
  PROCEDURE realizar_transferencia(
    p_cuenta_origen IN VARCHAR2,
    p_cuenta_destino IN VARCHAR2,
    p_monto IN NUMBER,
    p_usuario_id IN NUMBER
  ) IS
    v_trans_origen NUMBER;
    v_trans_destino NUMBER;
  BEGIN
    IF p_cuenta_origen = p_cuenta_destino THEN
      RAISE_APPLICATION_ERROR(-20012, 'La cuenta origen y destino no pueden ser la misma');
    END IF;

    -- 1) intentar retirar del origen (esto hará validaciones)
    realizar_retiro(p_cuenta_origen, p_monto, p_usuario_id);

    -- 2) crear transaccion de ingreso en destino
    v_trans_destino := PROYECTODB.SEQ_TRANSACCION_ID.NEXTVAL;
    INSERT INTO PROYECTODB.TBL_TRANSACCIONES (
      TRANSACCION_ID, CUENTA_ID, TIPO_TRANSACCION_ID, MONTO, FECHA_TRANSACCION
    ) VALUES (
      v_trans_destino, p_cuenta_destino, c_tipo_ingreso, p_monto, SYSDATE
    );

    -- actualizar saldo destino
    UPDATE PROYECTODB.TBL_CUENTAS
    SET SALDO = NVL(SALDO,0) + p_monto
    WHERE CUENTA_ID = p_cuenta_destino;

    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Si el retiro interno ya hizo COMMIT (no debería), aquí lo revertimos
      ROLLBACK;
      RAISE;
  END realizar_transferencia;


  ----------------------------------------------------------------------------
  -- FUNCION: generar_historial -> devuelve SYS_REFCURSOR
  ----------------------------------------------------------------------------
  FUNCTION generar_historial(
    p_cuenta_id IN VARCHAR2,
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE
  ) RETURN SYS_REFCURSOR IS
    rc SYS_REFCURSOR;
  BEGIN
    OPEN rc FOR
      SELECT t.TRANSACCION_ID,
             t.CUENTA_ID,
             tp.DESCRIPCION AS TIPO_TRANSACCION,
             t.MONTO,
             t.FECHA_TRANSACCION
      FROM PROYECTODB.TBL_TRANSACCIONES t
      LEFT JOIN PROYECTODB.TBL_TIPO_PARAMETROS tp
        ON tp.TIPO_PARAMETRO_ID = t.TIPO_TRANSACCION_ID
       AND tp.NOMBRE = 'Tipo-Transac'
      WHERE t.CUENTA_ID = p_cuenta_id
        AND t.FECHA_TRANSACCION BETWEEN p_fecha_inicio AND p_fecha_fin
      ORDER BY t.FECHA_TRANSACCION DESC;

    RETURN rc;
  EXCEPTION
    WHEN OTHERS THEN
      -- En caso de error, devuelve NULL (caller debe manejar)
      RETURN NULL;
  END generar_historial;


  ----------------------------------------------------------------------------
  -- PROCEDURE: listar_todas_transacciones (sin filtro de fechas)
  ----------------------------------------------------------------------------
  PROCEDURE listar_todas_transacciones(
    p_cursor OUT SYS_REFCURSOR
  ) IS
  BEGIN
    OPEN p_cursor FOR
      SELECT t.TRANSACCION_ID,
             t.CUENTA_ID,
             tp.DESCRIPCION AS TIPO_TRANSACCION,
             t.MONTO,
             t.FECHA_TRANSACCION
      FROM PROYECTODB.TBL_TRANSACCIONES t
      LEFT JOIN PROYECTODB.TBL_TIPO_PARAMETROS tp
        ON tp.TIPO_PARAMETRO_ID = t.TIPO_TRANSACCION_ID
       AND tp.NOMBRE = 'Tipo-Transac'
      ORDER BY t.FECHA_TRANSACCION DESC;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE_APPLICATION_ERROR(-20020, 'Error al listar transacciones: ' || SQLERRM);
  END listar_todas_transacciones;


  ----------------------------------------------------------------------------
  -- PROCEDURE: listar_todas_transacciones (con filtro de fechas)
  ----------------------------------------------------------------------------
  PROCEDURE listar_todas_transacciones(
    p_fecha_inicio IN DATE,
    p_fecha_fin IN DATE,
    p_cursor OUT SYS_REFCURSOR
  ) IS
  BEGIN
    IF p_fecha_inicio > p_fecha_fin THEN
      RAISE_APPLICATION_ERROR(-20021, 'La fecha de inicio no puede ser mayor a la fecha fin');
    END IF;

    OPEN p_cursor FOR
      SELECT t.TRANSACCION_ID,
             t.CUENTA_ID,
             tp.DESCRIPCION AS TIPO_TRANSACCION,
             t.MONTO,
             t.FECHA_TRANSACCION
      FROM PROYECTODB.TBL_TRANSACCIONES t
      LEFT JOIN PROYECTODB.TBL_TIPO_PARAMETROS tp
        ON tp.TIPO_PARAMETRO_ID = t.TIPO_TRANSACCION_ID
       AND tp.NOMBRE = 'Tipo-Transac'
      WHERE t.FECHA_TRANSACCION BETWEEN p_fecha_inicio AND p_fecha_fin
      ORDER BY t.FECHA_TRANSACCION DESC;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE_APPLICATION_ERROR(-20022, 'Error al listar transacciones con filtro: ' || SQLERRM);
  END listar_todas_transacciones;

END GESTION_TRANSACCIONES_PKG;