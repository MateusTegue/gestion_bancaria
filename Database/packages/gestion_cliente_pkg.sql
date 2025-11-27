-- =====================================================
-- PAQUETE: GESTION_CLIENTES_PKG
-- Descripción: Gestión de operaciones sobre clientes
-- =====================================================

CREATE OR REPLACE PACKAGE gestion_clientes_pkg IS
    -- Procedimiento para crear un nuevo cliente
    PROCEDURE crear_cliente(
        p_cliente_id IN NUMBER,
        p_primer_nombre IN VARCHAR2,
        p_segundo_nombre IN VARCHAR2,
        p_primer_apellido IN VARCHAR2,
        p_segundo_apellido IN VARCHAR2,
        p_identificacion IN NUMBER,
        p_direccion IN VARCHAR2
    );
    
    -- Procedimiento para actualizar información completa del cliente
    PROCEDURE actualizar_cliente(
        p_cliente_id IN NUMBER,
        p_primer_nombre IN VARCHAR2,
        p_segundo_nombre IN VARCHAR2,
        p_primer_apellido IN VARCHAR2,
        p_segundo_apellido IN VARCHAR2,
        p_direccion IN VARCHAR2
    );
    
    -- Procedimiento para actualizar solo dirección del cliente
    PROCEDURE actualizar_direccion_cliente(
        p_cliente_id IN NUMBER,
        p_direccion IN VARCHAR2
    );
    
    -- Procedimiento para eliminar (desactivar) un cliente
    PROCEDURE eliminar_cliente(
        p_cliente_id IN NUMBER,
        p_usuario_id IN NUMBER
    );
    
    -- Procedimiento para consultar información de un cliente
    PROCEDURE consultar_cliente(
        p_cliente_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para listar todos los clientes
    PROCEDURE listar_clientes(
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para buscar cliente por identificación
    PROCEDURE buscar_cliente_por_identificacion(
        p_identificacion IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Función para validar existencia de cliente
    FUNCTION validar_cliente(
        p_cliente_id IN NUMBER
    ) RETURN BOOLEAN;
    
    -- Función para obtener nombre completo del cliente
    FUNCTION obtener_nombre_completo(
        p_cliente_id IN NUMBER
    ) RETURN VARCHAR2;
    
    -- Función para contar cuentas de un cliente
    FUNCTION contar_cuentas_cliente(
        p_cliente_id IN NUMBER
    ) RETURN NUMBER;
END gestion_clientes_pkg;
/

CREATE OR REPLACE PACKAGE BODY gestion_clientes_pkg IS
    
    -- =====================================================
    -- PROCEDIMIENTO: crear_cliente
    -- Descripción: Crea un nuevo cliente en el sistema
    -- =====================================================
    PROCEDURE crear_cliente(
        p_cliente_id IN NUMBER,
        p_primer_nombre IN VARCHAR2,
        p_segundo_nombre IN VARCHAR2,
        p_primer_apellido IN VARCHAR2,
        p_segundo_apellido IN VARCHAR2,
        p_identificacion IN NUMBER,
        p_direccion IN VARCHAR2
    ) IS
        v_existe NUMBER;
    BEGIN
        -- Validar que el cliente no exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_CLIENTES
        WHERE CLIENTE_ID = p_cliente_id OR IDENTIFICACION = p_identificacion;
        
        IF v_existe > 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'El cliente ya existe en el sistema');
        END IF;
        
        -- Validar datos obligatorios
        IF p_primer_nombre IS NULL OR p_primer_apellido IS NULL THEN
            RAISE_APPLICATION_ERROR(-20004, 'Primer nombre y primer apellido son obligatorios');
        END IF;
        
        IF p_identificacion IS NULL OR p_identificacion <= 0 THEN
            RAISE_APPLICATION_ERROR(-20005, 'Identificación inválida');
        END IF;
        
        -- Insertar nuevo cliente
        INSERT INTO PROYECTODB.TBL_CLIENTES (
            CLIENTE_ID, PRIMER_NOMBRE, SEGUNDO_NOMBRE,
            PRIMER_APELLIDO, SEGUNDO_APELLIDO, 
            IDENTIFICACION, DIRECCION
        ) VALUES (
            p_cliente_id, UPPER(p_primer_nombre), UPPER(p_segundo_nombre),
            UPPER(p_primer_apellido), UPPER(p_segundo_apellido),
            p_identificacion, p_direccion
        );
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Cliente creado exitosamente: ' || p_cliente_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20002, 'Error al crear cliente: ' || SQLERRM);
    END crear_cliente;
    
    -- =====================================================
    -- PROCEDIMIENTO: actualizar_cliente
    -- Descripción: Actualiza información completa del cliente
    -- =====================================================
    PROCEDURE actualizar_cliente(
        p_cliente_id IN NUMBER,
        p_primer_nombre IN VARCHAR2,
        p_segundo_nombre IN VARCHAR2,
        p_primer_apellido IN VARCHAR2,
        p_segundo_apellido IN VARCHAR2,
        p_direccion IN VARCHAR2
    ) IS
        v_existe NUMBER;
    BEGIN
        -- Validar que el cliente exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_CLIENTES
        WHERE CLIENTE_ID = p_cliente_id;
        
        IF v_existe = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'Cliente no encontrado');
        END IF;
        
        -- Validar datos obligatorios
        IF p_primer_nombre IS NULL OR p_primer_apellido IS NULL THEN
            RAISE_APPLICATION_ERROR(-20004, 'Primer nombre y primer apellido son obligatorios');
        END IF;
        
        -- Actualizar información del cliente
        UPDATE PROYECTODB.TBL_CLIENTES
        SET PRIMER_NOMBRE = UPPER(p_primer_nombre),
            SEGUNDO_NOMBRE = UPPER(p_segundo_nombre),
            PRIMER_APELLIDO = UPPER(p_primer_apellido),
            SEGUNDO_APELLIDO = UPPER(p_segundo_apellido),
            DIRECCION = p_direccion
        WHERE CLIENTE_ID = p_cliente_id;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Cliente actualizado exitosamente: ' || p_cliente_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20006, 'Error al actualizar cliente: ' || SQLERRM);
    END actualizar_cliente;
    
    -- =====================================================
    -- PROCEDIMIENTO: actualizar_direccion_cliente
    -- Descripción: Actualiza solo la dirección del cliente
    -- =====================================================
    PROCEDURE actualizar_direccion_cliente(
        p_cliente_id IN NUMBER,
        p_direccion IN VARCHAR2
    ) IS
    BEGIN
        UPDATE PROYECTODB.TBL_CLIENTES
        SET DIRECCION = p_direccion
        WHERE CLIENTE_ID = p_cliente_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'Cliente no encontrado');
        END IF;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Dirección actualizada para cliente: ' || p_cliente_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END actualizar_direccion_cliente;
    
    -- =====================================================
    -- PROCEDIMIENTO: eliminar_cliente
    -- Descripción: Elimina cliente (solo si no tiene cuentas activas)
    -- =====================================================
    PROCEDURE eliminar_cliente(
        p_cliente_id IN NUMBER,
        p_usuario_id IN NUMBER
    ) IS
        v_tiene_cuentas NUMBER;
        v_rol_usuario NUMBER;
    BEGIN
        -- Verificar que el usuario sea administrador
        SELECT ROL_ID INTO v_rol_usuario
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        IF v_rol_usuario != 1 THEN
            RAISE_APPLICATION_ERROR(-20007, 'Solo administradores pueden eliminar clientes');
        END IF;
        
        -- Verificar si el cliente tiene cuentas activas
        SELECT COUNT(*) INTO v_tiene_cuentas
        FROM PROYECTODB.TBL_CUENTAS
        WHERE CLIENTE_ID = p_cliente_id
          AND ESTADO_ID = 1;
        
        IF v_tiene_cuentas > 0 THEN
            RAISE_APPLICATION_ERROR(-20008, 
                'No se puede eliminar cliente con cuentas activas. ' ||
                'Primero desactive las cuentas.');
        END IF;
        
        -- Eliminar cliente
        DELETE FROM PROYECTODB.TBL_CLIENTES
        WHERE CLIENTE_ID = p_cliente_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'Cliente no encontrado');
        END IF;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Cliente eliminado: ' || p_cliente_id);
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20009, 'Usuario no encontrado');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END eliminar_cliente;
    
    -- =====================================================
    -- PROCEDIMIENTO: consultar_cliente
    -- Descripción: Consulta información detallada de un cliente
    -- =====================================================
    PROCEDURE consultar_cliente(
        p_cliente_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                c.CLIENTE_ID,
                c.PRIMER_NOMBRE,
                c.SEGUNDO_NOMBRE,
                c.PRIMER_APELLIDO,
                c.SEGUNDO_APELLIDO,
                c.PRIMER_NOMBRE || ' ' || 
                NVL(c.SEGUNDO_NOMBRE || ' ', '') || 
                c.PRIMER_APELLIDO || ' ' || 
                NVL(c.SEGUNDO_APELLIDO, '') AS NOMBRE_COMPLETO,
                c.IDENTIFICACION,
                c.DIRECCION,
                COUNT(cu.CUENTA_ID) AS TOTAL_CUENTAS,
                NVL(SUM(cu.SALDO), 0) AS SALDO_TOTAL
            FROM PROYECTODB.TBL_CLIENTES c
            LEFT JOIN PROYECTODB.TBL_CUENTAS cu ON c.CLIENTE_ID = cu.CLIENTE_ID
            WHERE c.CLIENTE_ID = p_cliente_id
            GROUP BY 
                c.CLIENTE_ID, c.PRIMER_NOMBRE, c.SEGUNDO_NOMBRE,
                c.PRIMER_APELLIDO, c.SEGUNDO_APELLIDO, 
                c.IDENTIFICACION, c.DIRECCION;
    END consultar_cliente;
    
    -- =====================================================
    -- PROCEDIMIENTO: listar_clientes
    -- Descripción: Lista todos los clientes del sistema
    -- =====================================================
    PROCEDURE listar_clientes(
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                c.CLIENTE_ID,
                c.PRIMER_NOMBRE || ' ' || c.PRIMER_APELLIDO AS NOMBRE,
                c.IDENTIFICACION,
                c.DIRECCION,
                COUNT(cu.CUENTA_ID) AS TOTAL_CUENTAS,
                NVL(SUM(CASE WHEN cu.ESTADO_ID = 1 THEN cu.SALDO ELSE 0 END), 0) AS SALDO_TOTAL
            FROM PROYECTODB.TBL_CLIENTES c
            LEFT JOIN PROYECTODB.TBL_CUENTAS cu ON c.CLIENTE_ID = cu.CLIENTE_ID
            GROUP BY 
                c.CLIENTE_ID, c.PRIMER_NOMBRE, c.PRIMER_APELLIDO,
                c.IDENTIFICACION, c.DIRECCION
            ORDER BY c.PRIMER_APELLIDO, c.PRIMER_NOMBRE;
    END listar_clientes;
    
    -- =====================================================
    -- PROCEDIMIENTO: buscar_cliente_por_identificacion
    -- Descripción: Busca cliente por número de identificación
    -- =====================================================
    PROCEDURE buscar_cliente_por_identificacion(
        p_identificacion IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                c.CLIENTE_ID,
                c.PRIMER_NOMBRE,
                c.SEGUNDO_NOMBRE,
                c.PRIMER_APELLIDO,
                c.SEGUNDO_APELLIDO,
                c.IDENTIFICACION,
                c.DIRECCION
            FROM PROYECTODB.TBL_CLIENTES c
            WHERE c.IDENTIFICACION = p_identificacion;
    END buscar_cliente_por_identificacion;
    
    -- =====================================================
    -- FUNCIÓN: validar_cliente
    -- Descripción: Verifica si un cliente existe
    -- =====================================================
    FUNCTION validar_cliente(
        p_cliente_id IN NUMBER
    ) RETURN BOOLEAN IS
        v_existe NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_CLIENTES
        WHERE CLIENTE_ID = p_cliente_id;
        
        RETURN v_existe > 0;
    END validar_cliente;
    
    -- =====================================================
    -- FUNCIÓN: obtener_nombre_completo
    -- Descripción: Retorna el nombre completo del cliente
    -- =====================================================
    FUNCTION obtener_nombre_completo(
        p_cliente_id IN NUMBER
    ) RETURN VARCHAR2 IS
        v_nombre_completo VARCHAR2(200);
    BEGIN
        SELECT 
            PRIMER_NOMBRE || ' ' || 
            NVL(SEGUNDO_NOMBRE || ' ', '') || 
            PRIMER_APELLIDO || ' ' || 
            NVL(SEGUNDO_APELLIDO, '')
        INTO v_nombre_completo
        FROM PROYECTODB.TBL_CLIENTES
        WHERE CLIENTE_ID = p_cliente_id;
        
        RETURN TRIM(v_nombre_completo);
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END obtener_nombre_completo;
    
    -- FUNCIÓN: contar_cuentas_cliente
    -- Descripción: Cuenta el número de cuentas de un cliente
    FUNCTION contar_cuentas_cliente(
        p_cliente_id IN NUMBER
    ) RETURN NUMBER IS
        v_total NUMBER;
    BEGIN
        SELECT COUNT(*)
        INTO v_total
        FROM PROYECTODB.TBL_CUENTAS
        WHERE CLIENTE_ID = p_cliente_id;
        
        RETURN v_total;
        
    EXCEPTION
        WHEN OTHERS THEN
            RETURN 0;
    END contar_cuentas_cliente;
    
END gestion_clientes_pkg;