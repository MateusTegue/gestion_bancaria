DECLARE v BOOLEAN;
BEGIN
    v := gestion_cuentas_pkg.validar_cuenta_activa('FM88888');
    DBMS_OUTPUT.PUT_LINE(CASE WHEN v THEN 'Activa' ELSE 'Inactiva' END);
END;
/
