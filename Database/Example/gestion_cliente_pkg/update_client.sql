DECLARE
BEGIN
    gestion_clientes_pkg.actualizar_cliente(
        p_cliente_id        => 10177,
        p_primer_nombre     => 'María',
        p_segundo_nombre    => 'Fernanda',
        p_primer_apellido   => 'López',
        p_segundo_apellido  => 'García',
        p_direccion         => 'Nueva dirección 123'
    );

    DBMS_OUTPUT.PUT_LINE('✔ Caso exitoso completado');
END;
/
