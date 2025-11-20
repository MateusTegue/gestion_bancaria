BEGIN
    gestion_cuentas_pkg.crear_cuenta(
        p_cuenta_id     => 'FM88888',
        p_cliente_id    => 23,
        p_tipo_cuenta_id => 1,
        p_saldo_inicial  => 50000
    );
END;
/
