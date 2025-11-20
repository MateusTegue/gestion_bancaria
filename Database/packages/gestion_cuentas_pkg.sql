-- =====================================================
-- PAQUETE: GESTION_CUENTAS_PKG
-- Descripción: Gestión de cuentas bancarias
-- =====================================================

CREATE OR REPLACE PACKAGE gestion_cuentas_pkg IS
    -- Procedimiento para crear cuenta
    PROCEDURE crear_cuenta(
        p_cuenta_id IN VARCHAR2,
        p_cliente_id IN VARCHAR2,
        p_tipo_cuenta_id IN NUMBER,
        p_saldo_inicial IN NUMBER DEFAULT 0
    );
    
    -- Procedimiento para cambiar estado de cuenta
    PROCEDURE cambiar_estado_cuenta(
        p_cuenta_id IN VARCHAR2,
        p_estado_id IN NUMBER,
        p_usuario_id IN NUMBER
    );
    
    -- Función para consultar saldo
    FUNCTION consultar_saldo(
        p_cuenta_id IN VARCHAR2
    ) RETURN NUMBER;
    
    -- Función para validar cuenta activa
    FUNCTION validar_cuenta_activa(
        p_cuenta_id IN VARCHAR2
    ) RETURN BOOLEAN;


    PROCEDURE listar_cuentas_cliente(
        p_cliente_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    );

END gestion_cuentas_pkg;
/

CREATE OR REPLACE PACKAGE BODY gestion_cuentas_pkg IS
    
    PROCEDURE crear_cuenta(
        p_cuenta_id IN VARCHAR2,
        p_cliente_id IN VARCHAR2,
        p_tipo_cuenta_id IN NUMBER,
        p_saldo_inicial IN NUMBER DEFAULT 0
    ) IS
        v_cliente_existe BOOLEAN;
    BEGIN
        -- Validar que el cliente existe
        v_cliente_existe := gestion_clientes_pkg.validar_cliente(p_cliente_id);
        
        IF NOT v_cliente_existe THEN
            RAISE_APPLICATION_ERROR(-20010, 'El cliente no existe en el sistema');
        END IF;
        
        -- Validar saldo inicial
        IF p_saldo_inicial < 0 THEN
            RAISE_APPLICATION_ERROR(-20011, 'El saldo inicial no puede ser negativo');
        END IF;
        
        -- Crear cuenta
        INSERT INTO PROYECTODB.TBL_CUENTAS (
            CUENTA_ID, CLIENTE_ID, TIPO_CUENTA_ID, 
            ESTADO_ID, SALDO
        ) VALUES (
            p_cuenta_id, p_cliente_id, p_tipo_cuenta_id,
            1, p_saldo_inicial
        );
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Cuenta creada exitosamente: ' || p_cuenta_id);
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20012, 'Error al crear cuenta: ' || SQLERRM);
    END crear_cuenta;
    
    PROCEDURE cambiar_estado_cuenta(
        p_cuenta_id IN VARCHAR2,
        p_estado_id IN NUMBER,
        p_usuario_id IN NUMBER
    ) IS
        v_rol_usuario NUMBER;
    BEGIN
        -- Verificar que el usuario sea administrador (ROL_ID = 1)
        SELECT ROL_ID INTO v_rol_usuario
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO_ID = p_usuario_id;
        
        IF v_rol_usuario != 1 THEN
            RAISE_APPLICATION_ERROR(-20013, 'Solo administradores pueden cambiar estado de cuentas');
        END IF;
        
        -- Cambiar estado
        UPDATE PROYECTODB.TBL_CUENTAS
        SET ESTADO_ID = p_estado_id
        WHERE CUENTA_ID = p_cuenta_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20014, 'Cuenta no encontrada');
        END IF;
        
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Estado de cuenta actualizado');
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20015, 'Usuario no encontrado');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END cambiar_estado_cuenta;
    

    FUNCTION consultar_saldo(
        p_cuenta_id IN VARCHAR2
    ) RETURN NUMBER IS
        v_saldo NUMBER;
    BEGIN
        SELECT SALDO INTO v_saldo
        FROM PROYECTODB.TBL_CUENTAS
        WHERE CUENTA_ID = p_cuenta_id;
        
        RETURN v_saldo;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20016, 'Cuenta no encontrada');
    END consultar_saldo;
    

    FUNCTION validar_cuenta_activa(
        p_cuenta_id IN VARCHAR2
    ) RETURN BOOLEAN IS
        v_estado_id NUMBER;
    BEGIN
        SELECT ESTADO_ID INTO v_estado_id
        FROM PROYECTODB.TBL_CUENTAS
        WHERE CUENTA_ID = p_cuenta_id;
        
        RETURN v_estado_id = 1; -- 1 = Activa
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END validar_cuenta_activa;


    PROCEDURE listar_cuentas_cliente(
        p_cliente_id IN NUMBER,
        p_cursor OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT CUENTA_ID, TIPO_CUENTA_ID, ESTADO_ID, SALDO
            FROM PROYECTODB.TBL_CUENTAS
            WHERE CLIENTE_ID = p_cliente_id;
    END listar_cuentas_cliente;


    
END gestion_cuentas_pkg;
/