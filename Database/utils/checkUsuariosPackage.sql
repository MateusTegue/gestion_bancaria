-- Script para verificar si el paquete gestion_usuarios_pkg existe
-- Ejecutar como usuario PROYECTODB

SET SERVEROUTPUT ON;

DECLARE
    v_count NUMBER;
BEGIN
    -- Verificar si existe el paquete
    SELECT COUNT(*) 
    INTO v_count
    FROM user_objects
    WHERE object_name = 'GESTION_USUARIOS_PKG'
    AND object_type = 'PACKAGE';
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('✓ El paquete GESTION_USUARIOS_PKG existe');
        
        -- Verificar si el body también existe
        SELECT COUNT(*) 
        INTO v_count
        FROM user_objects
        WHERE object_name = 'GESTION_USUARIOS_PKG'
        AND object_type = 'PACKAGE BODY';
        
        IF v_count > 0 THEN
            DBMS_OUTPUT.PUT_LINE('✓ El PACKAGE BODY también existe');
        ELSE
            DBMS_OUTPUT.PUT_LINE('✗ FALTA el PACKAGE BODY');
        END IF;
        
        -- Verificar si hay errores de compilación
        SELECT COUNT(*) 
        INTO v_count
        FROM user_errors
        WHERE name = 'GESTION_USUARIOS_PKG';
        
        IF v_count > 0 THEN
            DBMS_OUTPUT.PUT_LINE('✗ Hay ' || v_count || ' errores de compilación:');
            FOR err IN (SELECT line, position, text 
                       FROM user_errors 
                       WHERE name = 'GESTION_USUARIOS_PKG'
                       ORDER BY sequence) LOOP
                DBMS_OUTPUT.PUT_LINE('  Línea ' || err.line || ', Pos ' || err.position || ': ' || err.text);
            END LOOP;
        ELSE
            DBMS_OUTPUT.PUT_LINE('✓ No hay errores de compilación');
        END IF;
    ELSE
        DBMS_OUTPUT.PUT_LINE('✗ El paquete GESTION_USUARIOS_PKG NO EXISTE');
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('SOLUCIÓN:');
        DBMS_OUTPUT.PUT_LINE('1. Conéctate a Oracle como usuario PROYECTODB');
        DBMS_OUTPUT.PUT_LINE('2. Ejecuta el archivo: Database/packages/gestion_usuarios_pkg.sql');
    END IF;
END;
/
