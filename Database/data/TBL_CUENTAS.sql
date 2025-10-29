DECLARE
    v_cliente_id   NUMBER;
    v_tipo_cuenta  NUMBER;
    v_estado_id    NUMBER;
    v_saldo        NUMBER(15,2);
    v_cuenta_id    VARCHAR2(20);
BEGIN
    FOR i IN 1..1500 LOOP
        -- Selecciona un cliente aleatorio entre 1 y 2000
        v_cliente_id := TRUNC(DBMS_RANDOM.VALUE(1, 2001));

        -- Generar ID de cuenta
        v_cuenta_id := 'CUENTA_' || TO_CHAR(i, 'FM0000');

        -- Tipo de cuenta: 4 = Ahorro, 5 = Corriente
        v_tipo_cuenta := CASE WHEN DBMS_RANDOM.VALUE(0,1) < 0.5 THEN 4 ELSE 5 END;

        -- Estado: Activo (1), Inactivo (2), Bloqueado (3), Cancelado (8)
        v_estado_id := CASE 
            WHEN DBMS_RANDOM.VALUE(0,1) < 0.6 THEN 1  -- 60% Activas
            WHEN DBMS_RANDOM.VALUE(0,1) < 0.8 THEN 2  -- 20% Inactivas
            WHEN DBMS_RANDOM.VALUE(0,1) < 0.9 THEN 3  -- 10% Bloqueadas
            ELSE 8                                   -- 10% Canceladas
        END;

        -- Saldo aleatorio o nulo
        IF DBMS_RANDOM.VALUE(0,1) < 0.15 THEN
            v_saldo := NULL; -- 15% sin saldo
        ELSE
            v_saldo := ROUND(DBMS_RANDOM.VALUE(0, 5000000), 2); -- entre 0 y 5 millones
        END IF;

        -- Inserción
        INSERT INTO PROYECTODB.TBL_CUENTAS (
            CUENTA_ID, CLIENTE_ID, TIPO_CUENTA_ID, ESTADO_ID, SALDO
        ) VALUES (
            v_cuenta_id,
            v_cliente_id,
            v_tipo_cuenta,
            v_estado_id,
            v_saldo
        );
    END LOOP;
    COMMIT;
END;
/
