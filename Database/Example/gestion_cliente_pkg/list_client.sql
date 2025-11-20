DECLARE
    v_cursor SYS_REFCURSOR;
    v_cliente_id NUMBER;
    v_nombre VARCHAR2(200);
    v_identificacion NUMBER;
    v_direccion VARCHAR2(200);
    v_total_cuentas NUMBER;
    v_saldo_total NUMBER;
BEGIN
    gestion_clientes_pkg.listar_clientes(v_cursor);

    LOOP
        FETCH v_cursor INTO 
            v_cliente_id, v_nombre, v_identificacion, 
            v_direccion, v_total_cuentas, v_saldo_total;

        EXIT WHEN v_cursor%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            'ID: ' || v_cliente_id ||
            ' - Nombre: ' || v_nombre ||
            ' - Cuentas: ' || v_total_cuentas ||
            ' - Saldo total: ' || v_saldo_total 
        );
    END LOOP;

    CLOSE v_cursor;
END;
/