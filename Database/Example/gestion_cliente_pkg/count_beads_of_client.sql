DECLARE
    v_total NUMBER;
BEGIN
    v_total := gestion_clientes_pkg.contar_cuentas_cliente(101);

    DBMS_OUTPUT.PUT_LINE('Total cuentas: ' || v_total);
END;
/
