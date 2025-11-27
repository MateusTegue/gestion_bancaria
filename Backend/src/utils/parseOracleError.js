/**
 * Parsea errores de Oracle y retorna mensajes más claros y amigables
 * @param {Error} error - Error de Oracle
 * @returns {string} Mensaje de error parseado y claro
 */
export const parseOracleError = (error) => {
    const errorMessage = error.message || '';
    
    // Buscar errores ORA comunes en el mensaje (incluso si están anidados)
    if (errorMessage.includes('ORA-00001')) {
        // Restricción única violada
        if (errorMessage.includes('PK_CUENTA_ID') || errorMessage.includes('CUENTA_ID') || errorMessage.includes('cuenta')) {
            return 'La cuenta con este ID ya existe en el sistema';
        }
        if (errorMessage.includes('PK_CLIENTE_ID') || errorMessage.includes('CLIENTE_ID') || errorMessage.includes('cliente')) {
            return 'El cliente con este ID ya existe en el sistema';
        }
        if (errorMessage.includes('IDENTIFICACION') || errorMessage.includes('identificacion')) {
            return 'Ya existe un cliente con esta identificación';
        }
        return 'Ya existe un registro con estos datos en el sistema';
    }
    
    if (errorMessage.includes('ORA-01400')) {
        return 'No se puede insertar un valor nulo en un campo obligatorio';
    }
    
    if (errorMessage.includes('ORA-02291')) {
        return 'El registro referenciado no existe (violación de integridad referencial)';
    }
    
    if (errorMessage.includes('ORA-02292')) {
        return 'No se puede eliminar el registro porque tiene registros relacionados';
    }
    
    if (errorMessage.includes('ORA-12899')) {
        return 'El valor es demasiado largo para el campo';
    }
    
    // Si el error tiene un código de error personalizado (errorNum negativo)
    if (error.errorNum) {
        // Extraer el mensaje personalizado si existe (buscar después del último ORA-)
        const oraMatches = errorMessage.match(/ORA-\d+:\s*([^ORA]+?)(?:\n|ORA-|$)/g);
        if (oraMatches && oraMatches.length > 0) {
            // Tomar el último mensaje (el más específico)
            const lastMatch = oraMatches[oraMatches.length - 1];
            const messageMatch = lastMatch.match(/ORA-\d+:\s*(.+?)(?:\n|ORA-|$)/);
            if (messageMatch && messageMatch[1]) {
                const extractedMessage = messageMatch[1].trim();
                // Si el mensaje extraído no contiene códigos ORA, usarlo
                if (!extractedMessage.includes('ORA-')) {
                    return extractedMessage;
                }
            }
        }
        
        // Si no se pudo extraer, buscar mensajes personalizados comunes
        if (errorMessage.includes('Error al crear cuenta')) {
            // Buscar el error ORA-00001 dentro del mensaje
            if (errorMessage.includes('ORA-00001')) {
                return 'La cuenta con este ID ya existe en el sistema';
            }
        }
        
        if (errorMessage.includes('Error al crear cliente')) {
            if (errorMessage.includes('ORA-00001')) {
                return 'El cliente con este ID ya existe en el sistema';
            }
        }
    }
    
    // Si no se encontró un patrón conocido, retornar un mensaje genérico pero sin los detalles técnicos
    if (errorMessage.includes('ORA-')) {
        return 'Error en la base de datos. Por favor, verifique los datos e intente nuevamente';
    }
    
    return errorMessage || 'Error desconocido en la base de datos';
};

