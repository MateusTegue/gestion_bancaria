DECLARE
    v_total_transacciones NUMBER := 1500;
    v_cuenta_id           VARCHAR2(20);
    v_tipo_transaccion    NUMBER;
    v_monto               NUMBER(15,2);
    v_fecha               DATE;
    v_num_trans           NUMBER;
    v_id                  NUMBER := 1;
BEGIN
    FOR i IN 1..1500 LOOP
        v_cuenta_id := 'CUENTA_' || TO_CHAR(i, 'FM0000');

        -- Determinar cuántas transacciones tendrá esta cuenta
        v_num_trans := CASE
            WHEN DBMS_RANDOM.VALUE(0,1) < 0.20 THEN 0   -- 20% sin transacciones
            WHEN DBMS_RANDOM.VALUE(0,1) < 0.80 THEN TRUNC(DBMS_RANDOM.VALUE(1,4)) -- 60% entre 1 y 3
            ELSE TRUNC(DBMS_RANDOM.VALUE(4,7)) -- 20% entre 4 y 6
        END;

        -- Generar transacciones si aplica
        FOR j IN 1..v_num_trans LOOP
            v_tipo_transaccion := CASE WHEN DBMS_RANDOM.VALUE(0,1) < 0.5 THEN 6 ELSE 7 END; -- 6=Ingreso, 7=Retiro
            v_monto := ROUND(DBMS_RANDOM.VALUE(5000, 2000000), 2);
            v_fecha := TRUNC(SYSDATE - DBMS_RANDOM.VALUE(0, 730)); -- Últimos 2 años

            INSERT INTO PROYECTODB.TBL_TRANSACCIONES (
                TRANSACCION_ID,
                CUENTA_ID,
                TIPO_TRANSACCION_ID,
                MONTO,
                FECHA_TRANSACCION
            ) VALUES (
                v_id,
                v_cuenta_id,
                v_tipo_transaccion,
                v_monto,
                v_fecha
            );

            v_id := v_id + 1;
        END LOOP;
    END LOOP;

    COMMIT;
END;
/
