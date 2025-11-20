DECLARE
    v_cursor SYS_REFCURSOR;
    v_id VARCHAR2(15);
    p_nombre VARCHAR2(100);
    s_nombre VARCHAR2(100);
    p_apellido VARCHAR2(100);
    s_apellido VARCHAR2(100);
    v_ident NUMBER;
    v_direccion VARCHAR2(200);
BEGIN
    gestion_clientes_pkg.buscar_cliente_por_identificacion(
        p_identificacion => '1000000000',
        p_cursor => v_cursor
    );

    LOOP
        FETCH v_cursor INTO 
            v_id, p_nombre, s_nombre, p_apellido, s_apellido,
            v_ident, v_direccion;

        EXIT WHEN v_cursor%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE(
            'Cliente ID: ' || v_id ||
            ' - Nombre: ' || p_nombre || ' ' || p_apellido
        );
    END LOOP;

    CLOSE v_cursor;
END;
/
