-- =====================================================
-- PAQUETE: AUTENTICACION_PKG
-- Descripción: Autenticación y seguridad
-- =====================================================

CREATE OR REPLACE PACKAGE autenticacion_pkg IS
    -- Función para validar credenciales
    FUNCTION validar_credenciales(
        p_usuario IN VARCHAR2,
        p_password IN VARCHAR2
    ) RETURN NUMBER;
    

END autenticacion_pkg;
/

CREATE OR REPLACE PACKAGE BODY autenticacion_pkg IS
    
    FUNCTION validar_credenciales(
        p_usuario IN VARCHAR2,
        p_password IN VARCHAR2
    ) RETURN NUMBER IS
        v_usuario_id NUMBER;
        v_password_bd VARCHAR2(20);
    BEGIN
        SELECT USUARIO_ID, PASSWORD 
        INTO v_usuario_id, v_password_bd
        FROM PROYECTODB.TBL_USUARIOS
        WHERE USUARIO = p_usuario;
        
        IF v_password_bd = p_password THEN
            RETURN v_usuario_id;
        ELSE
            RETURN -1; -- Credenciales inválidas
        END IF;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN -1; -- Usuario no existe
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20050, 'Error en validación: ' || SQLERRM);
    END validar_credenciales;
    
END autenticacion_pkg;
/