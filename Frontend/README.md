# Frontend - Gestión Bancaria

Frontend desarrollado con Vue.js 3, TypeScript y TailwindCSS para el sistema de gestión bancaria.

## Tecnologías

- **Vue.js 3** - Framework de JavaScript progresivo
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida
- **TailwindCSS** - Framework de CSS utility-first
- **Vue Router** - Router oficial para Vue.js
- **Axios** - Cliente HTTP para realizar peticiones al backend

## Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Layout.vue
│   │   └── Modal.vue
│   ├── router/          # Configuración de rutas
│   │   └── index.ts
│   ├── services/        # Servicios API
│   │   ├── api.ts
│   │   ├── clienteService.ts
│   │   └── cuentaService.ts
│   ├── types/           # Definiciones de tipos TypeScript
│   │   └── index.ts
│   ├── views/           # Vistas/páginas
│   │   ├── HomeView.vue
│   │   ├── ClientesView.vue
│   │   ├── ClienteFormView.vue
│   │   ├── ClienteDetailView.vue
│   │   └── CuentasView.vue
│   ├── App.vue          # Componente raíz
│   ├── main.ts          # Punto de entrada
│   └── style.css        # Estilos globales
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

## Desarrollo

Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción

Generar la versión de producción:
```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

## Funcionalidades

### Gestión de Clientes
- Listar todos los clientes
- Buscar cliente por identificación
- Crear nuevo cliente
- Editar cliente existente
- Ver detalle del cliente
- Eliminar cliente
- Ver cuentas asociadas a un cliente

### Gestión de Cuentas
- Listar cuentas por cliente
- Crear nueva cuenta
- Consultar saldo de cuenta
- Cambiar estado de cuenta (Activar/Desactivar)
- Filtrar cuentas por ID de cliente

## Configuración del Backend

El frontend está configurado para conectarse al backend en `http://localhost:3000` mediante un proxy configurado en `vite.config.ts`.

Asegúrate de que el backend esté corriendo y configurado para aceptar peticiones desde `http://localhost:5173`.

