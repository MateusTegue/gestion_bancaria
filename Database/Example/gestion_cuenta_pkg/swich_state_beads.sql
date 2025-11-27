
BEGIN
    gestion_cuentas_pkg.cambiar_estado_cuenta(
        p_cuenta_id => 'FM88888',
        p_estado_id => 2, 
        p_usuario_id => 1000
    );
END;
/
