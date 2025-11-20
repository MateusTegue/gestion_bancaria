DECLARE
BEGIN
    gestion_clientes_pkg.crear_cliente(
        p_cliente_id      => 10177,
        p_primer_nombre   => 'Carlos',
        p_segundo_nombre  => 'Andrés',
        p_primer_apellido => 'Gómez',
        p_segundo_apellido=> 'López',
        p_identificacion  => 999001,
        p_direccion       => 'Calle 10 #5-22'
    );

    DBMS_OUTPUT.PUT_LINE('✔ Caso exitoso ejecutado');
END;
/