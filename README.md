# 🌹 Floristería Eternal Rose

**Floristería Eternal Rose** es una aplicación web moderna para la gestión y venta de arreglos florales preservados, diseñada con una experiencia visual elegante y una arquitectura profesional orientada a producción.

El proyecto cuenta con un **catálogo público**, **carrito de compras**, y un **panel de administración protegido** para la gestión completa de productos, integrando autenticación y base de datos en tiempo real.

---

## ✨ Características principales

### 🛍️ Catálogo público

* Visualización de productos activos
* Diseño responsive y moderno
* Precios en pesos dominicanos (DOP)
* Vista limpia y optimizada para clientes

### 🛒 Carrito de compras

* Agregar y eliminar productos
* Actualizar cantidades
* Cálculo automático del total
* Interfaz modal intuitiva

### 🔐 Panel de Administración (/admin)

* Autenticación segura con correo y contraseña
* CRUD completo de productos:

  * Crear productos
  * Editar información
  * Eliminar productos
* Control de visibilidad (productos activos/inactivos)
* Cierre de sesión manual

### 📦 Gestión de datos

* Productos almacenados en base de datos remota
* Sincronización automática entre panel admin y catálogo
* Separación clara entre vista pública y administración

---

## 🧱 Tecnologías utilizadas

* **Frontend:** React + TypeScript
* **Bundler:** Vite
* **Estilos:** Tailwind CSS
* **Backend as a Service:** Supabase

  * Autenticación
  * Base de datos
* **Iconos:** Lucide React
* **Deploy:** Vercel

---

## 📁 Estructura del proyecto

```
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx
│   │   ├── Products.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartModal.tsx
│   │   └── ...
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── vercel.json
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Variables de entorno

El proyecto utiliza variables de entorno para la conexión con Supabase.

Estas **NO se suben al repositorio** y deben configurarse en el entorno de despliegue:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

---

## 🚀 Despliegue

La aplicación está preparada para desplegarse en **Vercel** como una SPA (Single Page Application).

Incluye configuración de rutas para permitir el acceso directo a `/admin` sin errores al refrescar.

---

## 🔒 Seguridad

* El panel de administración está protegido por autenticación
* Los productos inactivos no son visibles para el público
* Las credenciales sensibles se manejan exclusivamente mediante variables de entorno

---

## 📌 Estado del proyecto

✅ Funcional y listo para producción

🔧 Futuras mejoras posibles:

* Gestión de pedidos
* Pasarela de pago
* Gestión de usuarios
* Historial de ventas
* Roles de administrador

---

## 👩‍💻 Autora

**Manuela Michelle Mejía**
Desarrolladora Web

---

> *Floristería Eternal Rose — Belleza que perdura para siempre* 🌹
