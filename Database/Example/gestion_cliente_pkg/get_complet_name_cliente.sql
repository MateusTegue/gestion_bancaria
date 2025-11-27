DECLARE
    v_nombre VARCHAR2(200);
BEGIN
    v_nombre := gestion_clientes_pkg.obtener_nombre_completo(101);

    DBMS_OUTPUT.PUT_LINE('Nombre completo: ' || v_nombre);
END;
/
