# Configuración de Variables de Entorno - Backend

Este proyecto utiliza variables de entorno para configurar el servidor y la conexión a la base de datos.

## Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto Backend con las siguientes variables:

```env
PORT=8001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_CONNECT=tu_connect_string
```

### Descripción de Variables

- **PORT**: Puerto en el que correrá el servidor (por defecto: `8001`)
- **CORS_ORIGIN**: Origen permitido para CORS (puede ser múltiple separado por comas)
- **NODE_ENV**: Entorno de ejecución (`development` o `production`)
- **DB_USER**: Usuario de la base de datos Oracle
- **DB_PASSWORD**: Contraseña de la base de datos Oracle
- **DB_CONNECT**: String de conexión de Oracle (ej: `localhost:1521/XE`)

## Uso

Las variables se cargan automáticamente al iniciar la aplicación usando `dotenv/config`.

Para usar estas variables en el código:

```javascript
const port = process.env.PORT;
const corsOrigin = process.env.CORS_ORIGIN;
```

## Nota

El archivo `.env` no debe ser commiteado al repositorio. Usa `.env.example` como plantilla.

