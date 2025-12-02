# Configuración de Variables de Entorno - Frontend

Este proyecto utiliza variables de entorno para configurar la comunicación con el backend.

## Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto Frontend con las siguientes variables:

```env
VITE_API_URL=http://localhost:8001
VITE_API_BASE_PATH=/api
```

### Descripción de Variables

- **VITE_API_URL**: URL base del servidor backend (por defecto: `http://localhost:8001`)
- **VITE_API_BASE_PATH**: Ruta base de la API (por defecto: `/api`)

## Uso

Las variables de entorno en Vite deben comenzar con `VITE_` para ser expuestas al código del cliente.

Para usar estas variables en el código:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Nota

El archivo `.env` no debe ser commiteado al repositorio. Usa `.env.example` como plantilla.

