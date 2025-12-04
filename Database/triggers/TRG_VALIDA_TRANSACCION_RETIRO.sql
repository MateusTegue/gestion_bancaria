
--Logica ya implementada en el paquete, no es necesario el trigger

-- CREATE OR REPLACE TRIGGER trg_valida_transaccion_retiro
--     BEFORE INSERT ON PROYECTODB.TBL_TRANSACCIONES
--     FOR EACH ROW
-- DECLARE
--     v_saldo_actual NUMBER;
--     v_estado_cuenta NUMBER;
--     v_tipo_transaccion VARCHAR2(50);
-- BEGIN
--     -- Obtener tipo de transacción
--     SELECT NOMBRE INTO v_tipo_transaccion
--     FROM PROYECTODB.TBL_TIPO_PARAMETROS
--     WHERE TIPO_PARAMETRO_ID = :NEW.TIPO_TRANSACCION_ID;
    
--     -- Validar solo si es retiro o transferencia
--     IF UPPER(v_tipo_transaccion) IN ('RETIRO', 'TRANSFERENCIA') THEN
--         -- Obtener saldo y estado de cuenta
--         SELECT SALDO, ESTADO_ID 
--         INTO v_saldo_actual, v_estado_cuenta
--         FROM PROYECTODB.TBL_CUENTAS 
--         WHERE CUENTA_ID = :NEW.CUENTA_ID;
        
--         -- Validar cuenta activa
--         IF v_estado_cuenta != 1 THEN
--             RAISE_APPLICATION_ERROR(-20060, 
--                 'No se puede realizar operación en cuenta inactiva o bloqueada.');
--         END IF;
        
--         -- Validar saldo suficiente
--         IF v_saldo_actual < :NEW.MONTO THEN
--             RAISE_APPLICATION_ERROR(-20061, 
--                 'Saldo insuficiente. Disponible: $' || v_saldo_actual || 
--                 ', Solicitado: $' || :NEW.MONTO);
--         END IF;
--     END IF;
-- END;
-- /


-- INSERT INTO PROYECTODB.TBL_TRANSACCIONES (TRANSACCION_ID, CUENTA_ID, TIPO_TRANSACCION_ID, MONTO, FECHA_TRANSACCION)
-- VALUES (4002, 'CUENTA_0438', 7, 9908888888000.00, SYSDATE);
