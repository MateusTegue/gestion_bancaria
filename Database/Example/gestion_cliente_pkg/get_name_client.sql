DECLARE
    v_nombre VARCHAR2(200);
BEGIN
    v_nombre := gestion_clientes_pkg.obtener_nombre_completo(1230);
    DBMS_OUTPUT.PUT_LINE('Cliente: ' || v_nombre);
END;