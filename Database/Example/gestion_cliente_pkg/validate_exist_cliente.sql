DECLARE
    v BOOLEAN;
BEGIN
    v := gestion_clientes_pkg.validar_cliente(101);

    IF v THEN
        DBMS_OUTPUT.PUT_LINE('El Cliente existe');
    ELSE
        DBMS_OUTPUT.PUT_LINE('El cliente no existe');
    END IF;
END;
/