export const parseOracleError = (error) => {
    const errorMessage = error.message || '';
    
    // Manejar errores de aplicación específicos (pueden venir como positivo o negativo)
    const errorNum = error.errorNum ? Math.abs(error.errorNum) : null;
    
    if (errorNum === 20002) {
        // Extraer el número de cuenta del mensaje si está disponible
        const cuentaMatch = errorMessage.match(/cuenta\s+([A-Z0-9_]+)/i);
        if (cuentaMatch) {
            return `Fondos insuficientes en la cuenta ${cuentaMatch[1]}. Por favor, verifique el saldo disponible.`;
        }
        return 'Fondos insuficientes en la cuenta. Por favor, verifique el saldo disponible.';
    }
    
    if (errorMessage.includes('ORA-00001')) {
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
    
    if (error.errorNum) {
        const oraMatches = errorMessage.match(/ORA-\d+:\s*([^ORA]+?)(?:\n|ORA-|$)/g);
        if (oraMatches && oraMatches.length > 0) {
            const lastMatch = oraMatches[oraMatches.length - 1];
            const messageMatch = lastMatch.match(/ORA-\d+:\s*(.+?)(?:\n|ORA-|$)/);
            if (messageMatch && messageMatch[1]) {
                const extractedMessage = messageMatch[1].trim();
                if (!extractedMessage.includes('ORA-')) {
                    return extractedMessage;
                }
            }
        }
        
        if (errorMessage.includes('Error al crear cuenta')) {
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
    
    if (errorMessage.includes('ORA-')) {
        return 'Error en la base de datos. Por favor, verifique los datos e intente nuevamente';
    }
    
    return errorMessage || 'Error desconocido en la base de datos';
};

