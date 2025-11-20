DECLARE
    c SYS_REFCURSOR;
    v_id VARCHAR2(20);
    v_tipo NUMBER;
    v_estado NUMBER;
    v_saldo NUMBER;
BEGIN
    gestion_cuentas_pkg.listar_cuentas_cliente(23, c);

    LOOP
        FETCH c INTO v_id, v_tipo, v_estado, v_saldo;
        EXIT WHEN c%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            'Cuenta=' || v_id ||
            ' Tipo=' || v_tipo ||
            ' Estado=' || v_estado ||
            ' Saldo=' || v_saldo
        );
    END LOOP;
    CLOSE c;
END;
/