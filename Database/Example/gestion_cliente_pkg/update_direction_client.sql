DECLARE
BEGIN
    gestion_clientes_pkg.actualizar_direccion_cliente(
        p_cliente_id => 101,
        p_direccion  => 
    );

    DBMS_OUTPUT.PUT_LINE('✔ Dirección actualizada');
END;
/