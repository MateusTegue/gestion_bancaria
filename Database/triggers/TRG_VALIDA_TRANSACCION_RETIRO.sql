CREATE OR REPLACE TRIGGER PROYECTODB.TRG_VALIDA_TRANSACCION_RETIRO
BEFORE INSERT
ON PROYECTODB.TBL_TRANSACCIONES
FOR EACH ROW
DECLARE
    v_saldo_actual NUMBER(15,2);
    cuenta_no_existe EXCEPTION;
    PRAGMA EXCEPTION_INIT(cuenta_no_existe, -20000);
BEGIN
    -- Verificar si el tipo de transacción es 'RETIRO'
    IF :NEW.TIPO_TRANSACCION_ID = 7 THEN
        -- Obtener el saldo actual de la cuenta asociada
        BEGIN
            SELECT SALDO
            INTO v_saldo_actual
            FROM PROYECTODB.TBL_CUENTAS
            WHERE CUENTA_ID = :NEW.CUENTA_ID;
            
            -- Verificar si hay fondos suficientes para el retiro
            IF v_saldo_actual < :NEW.MONTO THEN
                RAISE_APPLICATION_ERROR(-20001, 'Fondos insuficientes para realizar el retiro.');
            END IF;
            
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20000, 'La cuenta asociada no existe.');
        END;
    END IF;
END TRG_VALIDA_TRANSACCION_RETIRO;
/


INSERT INTO PROYECTODB.TBL_TRANSACCIONES (TRANSACCION_ID, CUENTA_ID, TIPO_TRANSACCION_ID, MONTO, FECHA_TRANSACCION)
VALUES (4002, 'CUENTA_0438', 7, 9908888888000.00, SYSDATE);

