DECLARE v NUMBER;
BEGIN
    v := gestion_cuentas_pkg.consultar_saldo('FM88888');
    DBMS_OUTPUT.PUT_LINE('Saldo: ' || v);
END;
/
