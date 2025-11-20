BEGIN
    gestion_clientes_pkg.eliminar_cliente(
        p_cliente_id => 999,
        p_usuario_id => 1000
    );
END;