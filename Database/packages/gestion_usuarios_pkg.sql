-- =====================================================
-- PAQUETE: GESTION_USUARIOS_PKG
-- Descripción: Gestión de operaciones sobre usuarios
-- =====================================================

CREATE OR REPLACE PACKAGE gestion_usuarios_pkg IS
    -- Procedimiento para crear un nuevo usuario
    PROCEDURE crear_usuario(
        p_rol_id IN NUMBER,
        p_cliente_id IN VARCHAR2,
        p_usuario IN VARCHAR2,
        p_password IN VARCHAR2,
        p_usuario_id OUT NUMBER
    );
    
    -- Procedimiento para actualizar información del usuario
    PROCEDURE actualizar_usuario(
        p_usuario_id IN NUMBER,
        p_rol_id IN NUMBER,
        p_cliente_id IN VARCHAR2,
        p_usuario IN VARCHAR2
    );
    
    -- Procedimiento para cambiar contraseña del usuario
    PROCEDURE cambiar_password(
        p_usuario_id IN NUMBER,
        p_password_actual IN VARCHAR2,
        p_password_nuevo IN VARCHAR2
    );
    
    -- Procedimiento para resetear contraseña (solo administradores)
    PROCEDURE resetear_password(
        p_usuario_id IN NUMBER,
        p_password_nuevo IN VARCHAR2,
        p_admin_id IN NUMBER
    );
    
    -- Procedimiento para eliminar usuario
    PROCEDURE eliminar_usuario(
        p_usuario_id IN NUMBER,
        p_admin_id IN NUMBER
    );
    
    -- Procedimiento para consultar información de un usuario
    PROCEDURE consultar_usuario(
        p_usuario_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para listar todos los usuarios
    PROCEDURE listar_usuarios(
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para listar usuarios por rol
    PROCEDURE listar_usuarios_por_rol(
        p_rol_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para buscar usuario por nombre de usuario
    PROCEDURE buscar_usuario_por_nombre(
        p_usuario IN VARCHAR2,
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Función para validar existencia de usuario por ID
    FUNCTION validar_usuario(
        p_usuario_id IN NUMBER
    ) RETURN BOOLEAN;
    
    -- Función para validar si un nombre de usuario está disponible
    FUNCTION validar_usuario_disponible(
        p_usuario IN VARCHAR2
    ) RETURN BOOLEAN;
    
    -- Función para obtener el rol del usuario
    FUNCTION obtener_rol_usuario(
        p_usuario_id IN NUMBER
    ) RETURN NUMBER;
    
    -- Función para validar si un usuario es administrador
    FUNCTION es_administrador(
        p_usuario_id IN NUMBER
    ) RETURN BOOLEAN;
    
END gestion_usuarios_pkg;
/

CREATE OR REPLACE PACKAGE BODY gestion_usuarios_pkg IS
    
    -- =====================================================
    -- PROCEDIMIENTO: crear_usuario
    -- Descripción: Crea un nuevo usuario en el sistema
    -- =====================================================
    PROCEDURE crear_usuario(
        p_rol_id IN NUMBER,
        p_cliente_id IN VARCHAR2,
        p_usuario IN VARCHAR2,
        p_password IN VARCHAR2,
        p_usuario_id OUT NUMBER
    ) IS
        v_existe NUMBER;
        v_cliente_existe BOOLEAN;
    BEGIN
        -- Generar nuevo ID usando la secuencia
        SELECT SEQ_USUARIO_ID.NEXTVAL INTO p_usuario_id FROM DUAL;
        
        -- Validar que el usuario no exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO = p_usuario;
        
        IF v_existe > 0 THEN
            RAISE_APPLICATION_ERROR(-20101, 'El usuario ya existe en el sistema');
        END IF;
        
        -- Validar que el rol exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_ROLES
        WHERE ROL_ID = p_rol_id;
        
        IF v_existe = 0 THEN
            RAISE_APPLICATION_ERROR(-20102, 'El rol especificado no existe');
        END IF;
        
        -- Validar que el cliente exista si se proporciona
        IF p_cliente_id IS NOT NULL THEN
            v_cliente_existe := gestion_clientes_pkg.validar_cliente(p_cliente_id);
            IF NOT v_cliente_existe THEN
                RAISE_APPLICATION_ERROR(-20103, 'El cliente especificado no existe');
            END IF;
        END IF;
        
        -- Validar datos obligatorios
        IF p_usuario IS NULL OR p_password IS NULL THEN
            RAISE_APPLICATION_ERROR(-20104, 'Usuario y contraseña son obligatorios');
        END IF;
        
        IF LENGTH(p_password) < 6 THEN
            RAISE_APPLICATION_ERROR(-20105, 'La contraseña debe tener al menos 6 caracteres');
        END IF;
        
        -- Insertar nuevo usuario
        INSERT INTO PROYECTODB.TBL_USUARIOS (
            USUARIO_ID, ROL_ID, CLIENTE_ID, USUARIO, PASSWORD
        ) VALUES (
            p_usuario_id, p_rol_id, p_cliente_id, p_usuario, p_password
        );
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Usuario creado exitosamente: ' || p_usuario);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20106, 'Error al crear usuario: ' || SQLERRM);
    END crear_usuario;
    
    -- =====================================================
    -- PROCEDIMIENTO: actualizar_usuario
    -- Descripción: Actualiza información del usuario
    -- =====================================================
    PROCEDURE actualizar_usuario(
        p_usuario_id IN NUMBER,
        p_rol_id IN NUMBER,
        p_cliente_id IN VARCHAR2,
        p_usuario IN VARCHAR2
    ) IS
        v_existe NUMBER;
        v_cliente_existe BOOLEAN;
    BEGIN
        -- Validar que el usuario exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        IF v_existe = 0 THEN
            RAISE_APPLICATION_ERROR(-20107, 'Usuario no encontrado');
        END IF;
        
        -- Validar que el nuevo nombre de usuario no esté en uso
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO = p_usuario AND USUARIO_ID != p_usuario_id;
        
        IF v_existe > 0 THEN
            RAISE_APPLICATION_ERROR(-20108, 'El nombre de usuario ya está en uso');
        END IF;
        
        -- Validar que el rol exista
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_ROLES
        WHERE ROL_ID = p_rol_id;
        
        IF v_existe = 0 THEN
            RAISE_APPLICATION_ERROR(-20102, 'El rol especificado no existe');
        END IF;
        
        -- Validar que el cliente exista si se proporciona
        IF p_cliente_id IS NOT NULL THEN
            v_cliente_existe := gestion_clientes_pkg.validar_cliente(p_cliente_id);
            IF NOT v_cliente_existe THEN
                RAISE_APPLICATION_ERROR(-20103, 'El cliente especificado no existe');
            END IF;
        END IF;
        
        -- Actualizar información del usuario
        UPDATE PROYECTODB.TBL_USUARIOS
        SET ROL_ID = p_rol_id,
            CLIENTE_ID = p_cliente_id,
            USUARIO = p_usuario
        WHERE USUARIO_ID = p_usuario_id;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Usuario actualizado exitosamente: ' || p_usuario_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20109, 'Error al actualizar usuario: ' || SQLERRM);
    END actualizar_usuario;
    
    -- =====================================================
    -- PROCEDIMIENTO: cambiar_password
    -- Descripción: Cambia la contraseña del usuario (requiere contraseña actual)
    -- =====================================================
    PROCEDURE cambiar_password(
        p_usuario_id IN NUMBER,
        p_password_actual IN VARCHAR2,
        p_password_nuevo IN VARCHAR2
    ) IS
        v_password_bd VARCHAR2(20);
    BEGIN
        -- Validar contraseña actual
        SELECT PASSWORD INTO v_password_bd
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        IF v_password_bd != p_password_actual THEN
            RAISE_APPLICATION_ERROR(-20110, 'La contraseña actual no es correcta');
        END IF;
        
        -- Validar nueva contraseña
        IF p_password_nuevo IS NULL OR LENGTH(p_password_nuevo) < 6 THEN
            RAISE_APPLICATION_ERROR(-20105, 'La nueva contraseña debe tener al menos 6 caracteres');
        END IF;
        
        -- Actualizar contraseña
        UPDATE PROYECTODB.TBL_USUARIOS
        SET PASSWORD = p_password_nuevo
        WHERE USUARIO_ID = p_usuario_id;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Contraseña actualizada exitosamente');
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20107, 'Usuario no encontrado');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END cambiar_password;
    
    -- =====================================================
    -- PROCEDIMIENTO: resetear_password
    -- Descripción: Resetea la contraseña del usuario (solo administradores)
    -- =====================================================
    PROCEDURE resetear_password(
        p_usuario_id IN NUMBER,
        p_password_nuevo IN VARCHAR2,
        p_admin_id IN NUMBER
    ) IS
        v_es_admin BOOLEAN;
    BEGIN
        -- Verificar que el usuario que realiza la acción es administrador
        v_es_admin := es_administrador(p_admin_id);
        
        IF NOT v_es_admin THEN
            RAISE_APPLICATION_ERROR(-20111, 'Solo administradores pueden resetear contraseñas');
        END IF;
        
        -- Validar nueva contraseña
        IF p_password_nuevo IS NULL OR LENGTH(p_password_nuevo) < 6 THEN
            RAISE_APPLICATION_ERROR(-20105, 'La nueva contraseña debe tener al menos 6 caracteres');
        END IF;
        
        -- Actualizar contraseña
        UPDATE PROYECTODB.TBL_USUARIOS
        SET PASSWORD = p_password_nuevo
        WHERE USUARIO_ID = p_usuario_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20107, 'Usuario no encontrado');
        END IF;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Contraseña reseteada exitosamente para usuario: ' || p_usuario_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END resetear_password;
    
    -- =====================================================
    -- PROCEDIMIENTO: eliminar_usuario
    -- Descripción: Elimina un usuario (solo administradores)
    -- =====================================================
    PROCEDURE eliminar_usuario(
        p_usuario_id IN NUMBER,
        p_admin_id IN NUMBER
    ) IS
        v_es_admin BOOLEAN;
        v_rol_usuario NUMBER;
    BEGIN
        -- Verificar que el usuario que realiza la acción es administrador
        v_es_admin := es_administrador(p_admin_id);
        
        IF NOT v_es_admin THEN
            RAISE_APPLICATION_ERROR(-20111, 'Solo administradores pueden eliminar usuarios');
        END IF;
        
        -- No permitir que un administrador se elimine a sí mismo
        IF p_usuario_id = p_admin_id THEN
            RAISE_APPLICATION_ERROR(-20112, 'No puede eliminar su propio usuario');
        END IF;
        
        -- Eliminar usuario
        DELETE FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20107, 'Usuario no encontrado');
        END IF;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Usuario eliminado: ' || p_usuario_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END eliminar_usuario;
    
    -- =====================================================
    -- PROCEDIMIENTO: consultar_usuario
    -- Descripción: Consulta información detallada de un usuario
    -- =====================================================
    PROCEDURE consultar_usuario(
        p_usuario_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                u.USUARIO_ID,
                u.ROL_ID,
                r.NOMBRE AS ROL_NOMBRE,
                u.CLIENTE_ID,
                CASE 
                    WHEN u.CLIENTE_ID IS NOT NULL THEN
                        gestion_clientes_pkg.obtener_nombre_completo(u.CLIENTE_ID)
                    ELSE NULL
                END AS NOMBRE_CLIENTE,
                u.USUARIO
            FROM PROYECTODB.TBL_USUARIOS u
            INNER JOIN PROYECTODB.TBL_ROLES r ON u.ROL_ID = r.ROL_ID
            WHERE u.USUARIO_ID = p_usuario_id;
    END consultar_usuario;
    
    -- =====================================================
    -- PROCEDIMIENTO: listar_usuarios
    -- Descripción: Lista todos los usuarios del sistema
    -- =====================================================
    PROCEDURE listar_usuarios(
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                u.USUARIO_ID,
                u.USUARIO,
                r.NOMBRE AS ROL,
                u.CLIENTE_ID,
                CASE 
                    WHEN u.CLIENTE_ID IS NOT NULL THEN
                        gestion_clientes_pkg.obtener_nombre_completo(u.CLIENTE_ID)
                    ELSE 'N/A'
                END AS NOMBRE_CLIENTE
            FROM PROYECTODB.TBL_USUARIOS u
            INNER JOIN PROYECTODB.TBL_ROLES r ON u.ROL_ID = r.ROL_ID
            ORDER BY u.USUARIO_ID;
    END listar_usuarios;
    
    -- =====================================================
    -- PROCEDIMIENTO: listar_usuarios_por_rol
    -- Descripción: Lista usuarios filtrados por rol
    -- =====================================================
    PROCEDURE listar_usuarios_por_rol(
        p_rol_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                u.USUARIO_ID,
                u.USUARIO,
                r.NOMBRE AS ROL,
                u.CLIENTE_ID,
                CASE 
                    WHEN u.CLIENTE_ID IS NOT NULL THEN
                        gestion_clientes_pkg.obtener_nombre_completo(u.CLIENTE_ID)
                    ELSE 'N/A'
                END AS NOMBRE_CLIENTE
            FROM PROYECTODB.TBL_USUARIOS u
            INNER JOIN PROYECTODB.TBL_ROLES r ON u.ROL_ID = r.ROL_ID
            WHERE u.ROL_ID = p_rol_id
            ORDER BY u.USUARIO;
    END listar_usuarios_por_rol;
    
    -- =====================================================
    -- PROCEDIMIENTO: buscar_usuario_por_nombre
    -- Descripción: Busca usuario por nombre de usuario
    -- =====================================================
    PROCEDURE buscar_usuario_por_nombre(
        p_usuario IN VARCHAR2,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                u.USUARIO_ID,
                u.USUARIO,
                r.NOMBRE AS ROL,
                u.CLIENTE_ID,
                CASE 
                    WHEN u.CLIENTE_ID IS NOT NULL THEN
                        gestion_clientes_pkg.obtener_nombre_completo(u.CLIENTE_ID)
                    ELSE 'N/A'
                END AS NOMBRE_CLIENTE
            FROM PROYECTODB.TBL_USUARIOS u
            INNER JOIN PROYECTODB.TBL_ROLES r ON u.ROL_ID = r.ROL_ID
            WHERE UPPER(u.USUARIO) LIKE '%' || UPPER(p_usuario) || '%';
    END buscar_usuario_por_nombre;
    
    -- =====================================================
    -- FUNCIÓN: validar_usuario
    -- Descripción: Verifica si un usuario existe por ID
    -- =====================================================
    FUNCTION validar_usuario(
        p_usuario_id IN NUMBER
    ) RETURN BOOLEAN IS
        v_existe NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        RETURN v_existe > 0;
    END validar_usuario;
    
    -- =====================================================
    -- FUNCIÓN: validar_usuario_disponible
    -- Descripción: Verifica si un nombre de usuario está disponible
    -- =====================================================
    FUNCTION validar_usuario_disponible(
        p_usuario IN VARCHAR2
    ) RETURN BOOLEAN IS
        v_existe NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_existe
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO = p_usuario;
        
        RETURN v_existe = 0;
    END validar_usuario_disponible;
    
    -- =====================================================
    -- FUNCIÓN: obtener_rol_usuario
    -- Descripción: Retorna el rol del usuario
    -- =====================================================
    FUNCTION obtener_rol_usuario(
        p_usuario_id IN NUMBER
    ) RETURN NUMBER IS
        v_rol_id NUMBER;
    BEGIN
        SELECT ROL_ID INTO v_rol_id
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        RETURN v_rol_id;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END obtener_rol_usuario;
    
    -- =====================================================
    -- FUNCIÓN: es_administrador
    -- Descripción: Verifica si un usuario es administrador
    -- =====================================================
    FUNCTION es_administrador(
        p_usuario_id IN NUMBER
    ) RETURN BOOLEAN IS
        v_rol_id NUMBER;
    BEGIN
        SELECT ROL_ID INTO v_rol_id
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        RETURN v_rol_id = 1; -- 1 = Administrador
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END es_administrador;
    
END gestion_usuarios_pkg;
/
