DECLARE
    v_cursor SYS_REFCURSOR;

    v_id NUMBER;
    v_primer_nombre VARCHAR2(200);
    v_segundo_nombre VARCHAR2(200);
    v_primer_apellido VARCHAR2(200);
    v_segundo_apellido VARCHAR2(200);
    v_nombre_completo VARCHAR2(400);
    v_identificacion NUMBER;
    v_direccion VARCHAR2(300);
    v_total_cuentas NUMBER;
    v_saldo_total NUMBER;

BEGIN
    gestion_clientes_pkg.consultar_cliente(1230, v_cursor);

    FETCH v_cursor INTO 
        v_id,
        v_primer_nombre,
        v_segundo_nombre,
        v_primer_apellido,
        v_segundo_apellido,
        v_nombre_completo,
        v_identificacion,
        v_direccion,
        v_total_cuentas,
        v_saldo_total;

    DBMS_OUTPUT.PUT_LINE(v_nombre_completo || ' tiene ' || v_total_cuentas || ' cuentas');

    CLOSE v_cursor;
END;
/