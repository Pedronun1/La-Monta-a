# Restaurante La Montaña — Full-Stack Web & Panel de Administración Seguro

Aplicación web gastronómica de alta cocina y sistema de reservas con panel de administración protegido por sesiones para el **Restaurante La Montaña**, ubicado en **C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid** (`+34 915 47 31 11`).

---

## 🏗️ Arquitectura y Stack Tecnológico

* **Backend:** Node.js + Express + Motor de vistas **EJS** + Autenticación por sesiones **`express-session`** (con cookies firmadas `HttpOnly` y verificación criptográfica *timing-safe* `crypto.timingSafeEqual`).
* **Persistencia:** Base de datos relacional **SQLite** nativa (`node:sqlite` → `lamontana.db`).
* **Frontend / Dirección de Arte UI/UX:** HTML5 semántico, **Tailwind CSS** avanzado con estética gastronómica de lujo (fondo negro pizarra `#09090b`, acentos en ámbar cálido `#f59e0b`, bordes sutiles `border-stone-800`, tipografías *Cormorant Garamond* y *Plus Jakarta Sans*, navegación `backdrop-blur-md bg-stone-950/80 sticky top-0 z-50` y transiciones suaves).

```text
restaurante/
├── server.js                      # Servidor Express, rutas públicas, sesiones y protección /admin
├── database.js                    # Capa de datos SQLite (lamontana.db) y métricas en tiempo real
├── lamontana.db                   # Base de datos SQLite persistente
├── package.json                   # Configuración y scripts (npm start, npm run dev)
├── tailwind.config.js             # Configuración de tema oscuro y paleta ámbar
│
├── data/
│   └── restaurantData.js          # Catálogo gastronómico (Entrantes, Principales, Postres, Vinos)
│
├── views/
│   ├── index.ejs                  # Vista pública principal de alta cocina y motor de reservas
│   ├── admin-login.ejs            # Pantalla de login protegida (/admin/login)
│   └── admin-dashboard.ejs        # Panel privado de administración en tiempo real (/admin)
│
└── public/
    ├── css/
    │   └── luxury.css             # Animaciones, efectos shine, scrollbars y estilos de lujo
    └── js/
        ├── main.js                # Filtrado interactivo de carta, disponibilidad y envío de reservas
        └── admin.js               # Controlador en tiempo real de la tabla de reservas en /admin
```

---

## 🔐 Seguridad del Panel de Administración (`/admin`)

1. **Protección Estricta por Sesión (`requireAdminAuth`):**
   * Cualquier intento de acceder a `GET /admin` sin una sesión autenticada redirige obligatoriamente a **`/admin/login`**.
   * Las rutas de la API privada (`/api/admin/*`) verifican la sesión activa y devuelven `401 Unauthorized` si no existe sesión válida.
2. **Credenciales Configurables por Entorno:**
   * Variable de entorno: `process.env.ADMIN_PASSWORD`
   * **Usuario por defecto:** `admin`
   * **Contraseña por defecto:** `lamontana2026`
3. **Destrucción Segura de Sesión (`/admin/logout`):**
   * El botón **"Cerrar Sesión"** en la cabecera del panel invoca `req.session.destroy()`, elimina la cookie firmada `lamontana.sid` y redirige a `/admin/login?logout=1`.

---

## 🚀 Puesta en Marcha

```bash
cd restaurante
npm start
```

* **Web Pública:** `http://localhost:3000/`
* **Login de Administración:** `http://localhost:3000/admin/login`
* **Panel Privado de Reservas:** `http://localhost:3000/admin` *(Redirige automáticamente a `/admin/login` si no se ha iniciado sesión)*
