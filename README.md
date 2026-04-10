# Frontend MS Tienda

Aplicacion React + Vite para consumir los 4 microservicios del proyecto:

- `equipo1Login` en `8000`
- `equipo2products` en `8001`
- `equipo3Pedidos` en `8003`
- `equipo4Pagos` en `8004`

## Funcionalidad

- Login y registro de usuario
- Catalogo de productos
- Carrito persistido en `localStorage`
- Creacion de pedidos
- Procesamiento de pagos
- Vista de pedidos del usuario autenticado
- Panel de administracion de productos

## Rutas principales

- `/login`
- `/shop`
- `/checkout`
- `/payment/:orderId`
- `/orders`
- `/admin/products`

## Requisitos

- `Node.js` 18 o superior
- `npm` 9 o superior

## Variables de entorno

Archivo `.env`:

```env
VITE_EQ1_BASE=http://127.0.0.1:8000
VITE_EQ2_BASE=http://127.0.0.1:8001
VITE_EQ3_BASE=http://127.0.0.1:8003
VITE_EQ4_BASE=http://127.0.0.1:8004
```

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Frontend local:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

## Preparado Para GitHub

Este frontend ya incluye:

- `README.md`
- `LICENSE`
- `.gitignore`
- `.env.example`

Si lo quieres subir como repo independiente:

```bash
git init
git branch -M main
git remote add origin https://github.com/RichartM/UIII_T1_front.git
git add .
git commit -m "Initial frontend commit"
git push -u origin main
```

## Dependencias principales

- `react`
- `react-dom`
- `react-router-dom`
- `bootstrap`
- `vite`
- `@vitejs/plugin-react`

## Notas

- Para que pedidos y pagos funcionen, los 4 microservicios deben estar levantados en los puertos correctos.
