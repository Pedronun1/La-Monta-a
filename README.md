# Restaurante La Montaña — Aplicación Web Full-Stack (Madrid)

Aplicación web completa (Frontend en **React / Next.js + Tailwind CSS** y Backend en **Node.js + Express + SQLite**) para el **Restaurante La Montaña**, ubicado en **C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid** (`+34 915 47 31 11`).

---

## 📂 Estructura del Proyecto (`restaurante/`)

```text
restaurante/
├── server.js                              # Servidor Backend Node.js + Express (API RESTful + SPA)
├── database.js                            # Capa de persistencia SQLite nativa (node:sqlite -> lamontana.db)
├── lamontana.db                           # Base de datos SQLite autogenerada con reservas persistentes
├── tailwind.config.js                     # Configuración de paleta castiza y tipografías en Tailwind CSS
├── package.json                           # Dependencias y scripts de ejecución
├── README.md                              # Documentación técnica y guía de uso
│
├── data/
│   └── restaurantData.js                  # Datos oficiales (Google Maps), horarios, reseñas y carta completa
│
├── public/                                # Frontend React 18 + Tailwind CSS listo para ejecución inmediata
│   ├── index.html                         # Documento principal con SEO Local y Schema.org Restaurant
│   └── app.js                             # Aplicación React interactiva conectada a la API REST
│
└── src/                                   # Arquitectura Modular React / Next.js (App Router)
    ├── app/
    │   ├── layout.jsx                     # Root Layout con fuentes Playfair Display & Plus Jakarta Sans
    │   ├── page.jsx                       # Página principal integrando todos los módulos
    │   └── api/
    │       ├── menu/route.js              # Endpoint Next.js GET /api/menu
    │       ├── reservations/route.js      # Endpoint Next.js GET & POST /api/reservations
    │       └── info/route.js              # Endpoint Next.js GET /api/info
    └── components/
        ├── Navbar.jsx                     # Barra de navegación fija con contador de platos preseleccionados
        ├── Hero.jsx                       # Hero Section con eslogan, botones rápidos y horarios de Google Maps
        ├── MenuSection.jsx                # Carta interactiva por categorías, buscador y precios exactos
        ├── ReservationSection.jsx         # Motor de reservas con validación en tiempo real y cupos por turno
        ├── ReviewsSection.jsx             # Valoración 4.6★ y reseñas verificadas de clientes en Google Maps
        ├── ContactMapSection.jsx          # Dirección en C. del Rey Francisco, 28, transporte y Google Maps
        └── Footer.jsx                     # Pie de página institucional
```

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
cd restaurante
npm start
```

El servidor se iniciará en `http://localhost:3000`:
- **Web Principal (React + Tailwind CSS):** `http://localhost:3000`
- **API Carta y Precios:** `GET http://localhost:3000/api/menu`
- **API Información, Horarios y Reseñas:** `GET http://localhost:3000/api/info`
- **API Reservas de Mesa:** `POST http://localhost:3000/api/reservations` y `GET http://localhost:3000/api/reservations`
