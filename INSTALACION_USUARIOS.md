# Instalación del Módulo de Gestión de Usuarios

## Problema Actual
El error "Error al cargar usuarios" ocurre porque **el paquete PL/SQL `gestion_usuarios_pkg` no está instalado en la base de datos Oracle**.

## Solución: Instalar el Paquete en Oracle

### Opción 1: Usando SQL*Plus (Recomendado)

1. **Abrir SQL*Plus** y conectarse como usuario PROYECTODB:
```bash
sqlplus PROYECTODB/tu_password@localhost:1521/XEPDB1
```

2. **Verificar si el paquete existe**:
```bash
@Database/utils/checkUsuariosPackage.sql
```

3. **Instalar el paquete** (si no existe):
```bash
@Database/packages/gestion_usuarios_pkg.sql
```

4. **Verificar la instalación**:
```sql
SELECT object_name, object_type, status 
FROM user_objects 
WHERE object_name = 'GESTION_USUARIOS_PKG';
```

Deberías ver 2 filas:
- `GESTION_USUARIOS_PKG | PACKAGE | VALID`
- `GESTION_USUARIOS_PKG | PACKAGE BODY | VALID`

### Opción 2: Usando SQL Developer / DBeaver

1. **Conectarse** a la base de datos como usuario `PROYECTODB`

2. **Abrir el archivo**: `Database/packages/gestion_usuarios_pkg.sql`

3. **Ejecutar todo el script** (F5 o botón Run Script)

4. **Verificar** que no haya errores en el log

### Opción 3: Desde PowerShell

```powershell
# Navegar al directorio del proyecto
cd "C:\Users\Roberto Carlos\Documents\gestion_bancaria"

# Ejecutar el script SQL
sqlplus PROYECTODB/tu_password@localhost:1521/XEPDB1 @Database/packages/gestion_usuarios_pkg.sql
```

## Verificación Post-Instalación

Una vez instalado el paquete, **reinicia el servidor backend**:

```powershell
# En la terminal del backend
# Ctrl+C para detener el servidor actual
npm run dev
```

Luego recarga la página del frontend y la lista de usuarios debería cargar correctamente.

## Contenido del Paquete

El paquete `gestion_usuarios_pkg` incluye:

### Procedimientos (9):
1. `crear_usuario` - Crear nuevo usuario
2. `actualizar_usuario` - Actualizar datos del usuario
3. `cambiar_password` - Cambiar contraseña (usuario mismo)
4. `resetear_password` - Resetear contraseña (solo admin)
5. `eliminar_usuario` - Eliminar usuario (solo admin)
6. `consultar_usuario` - Obtener datos de un usuario
7. `listar_usuarios` - Listar todos los usuarios
8. `listar_usuarios_por_rol` - Filtrar usuarios por rol
9. `buscar_usuario_por_nombre` - Buscar por nombre de usuario

### Funciones (4):
1. `validar_usuario` - Validar credenciales de login
2. `validar_usuario_disponible` - Verificar si nombre de usuario está disponible
3. `obtener_rol_usuario` - Obtener el rol de un usuario
4. `es_administrador` - Verificar si usuario es administrador

## Códigos de Error

El paquete maneja los siguientes errores:
- `-20101`: Usuario ya existe
- `-20102`: Usuario no disponible
- `-20103`: Usuario no encontrado
- `-20104`: Cliente no válido
- `-20105`: Rol no válido
- `-20106`: Contraseña actual incorrecta
- `-20107`: Contraseña muy corta (mínimo 6 caracteres)
- `-20108`: Solo administradores pueden resetear contraseñas
- `-20109`: Solo administradores pueden eliminar usuarios
- `-20110`: No se puede eliminar a sí mismo
- `-20111`: Credenciales inválidas
- `-20112`: Usuario inactivo

## Troubleshooting

### Si el paquete no compila:

1. Verificar que existen las tablas:
```sql
SELECT table_name FROM user_tables 
WHERE table_name IN ('TBL_USUARIOS', 'TBL_CLIENTES', 'TBL_ROLES');
```

2. Verificar que existe el paquete `gestion_clientes_pkg`:
```sql
SELECT object_name, status 
FROM user_objects 
WHERE object_name = 'GESTION_CLIENTES_PKG';
```

3. Ver errores de compilación:
```sql
SELECT line, position, text 
FROM user_errors 
WHERE name = 'GESTION_USUARIOS_PKG'
ORDER BY sequence;
```

### Si hay errores 404 en el frontend:

Verifica que todas las rutas estén registradas en `Backend/src/routers/index.js`:
```javascript
router.use('/api/usuarios', listAllUsersRoutes);
```

### Si hay errores de conexión a la BD:

Verifica el archivo `.env` en el Backend:
```env
DB_USER=PROYECTODB
DB_PASSWORD=tu_password
DB_CONNECT=localhost:1521/XEPDB1
PORT=8001
```
