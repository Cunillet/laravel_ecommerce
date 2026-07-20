# Cuntras — Laravel Ecommerce

Plataforma de comercio electrónico construida con **Laravel 13**, **Inertia.js** y **React**, completamente dockerizada para un desarrollo rápido y consistente.

> **Marca:** Cuntras
> 
> **Estado:** En desarrollo activo

---

## Requisitos

- **Docker Desktop** (o Docker Engine + Docker Compose)
- No requiere PHP, Composer ni Node.js instalados en el equipo anfitrión

---

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cunillet/laravel_ecommerce.git laravel_ecommerce
cd laravel_ecommerce

# 2. Copiar y configurar variables de entorno
cp .env.example .env

# 3. Iniciar todos los servicios
docker compose up -d

# 4. Instalar dependencias de PHP (Composer)
docker compose exec php composer install

# 5. Generar clave de aplicación
docker compose exec php php artisan key:generate

# 6. Ejecutar migraciones y seeders
docker compose exec php php artisan migrate --seed

# 7. Instalar dependencias de Node.js y compilar assets
docker compose exec node npm install
docker compose exec node npm run build

# 8. ¡Listo! Abrir http://localhost:8080
```

---

## URLs de los servicios

| Servicio     | URL                          | Descripción                     |
| ------------ | ---------------------------- | ------------------------------- |
| **Aplicación** | http://localhost:8080       | Frontend Laravel + React        |
| **phpMyAdmin** | http://localhost:8081       | Gestor de base de datos MySQL   |
| **MySQL**      | localhost:3306             | Conexión directa a la BD        |

### Credenciales por defecto

| Servicio    | Usuario      | Contraseña | Base de datos       |
| ----------- | ------------ | ---------- | ------------------- |
| MySQL       | `laravel`    | `root`     | `laravel_ecommerce` |
| MySQL (root)| `root`       | `root`     | `laravel_ecommerce` |
| phpMyAdmin  | `root`       | `root`     | —                   |

> **Nota:** Las credenciales se pueden modificar en el archivo `.env`.

---

## Servicios Docker

| Contenedor       | Imagen                    | Puerto   | Descripción                                  |
| ---------------- | ------------------------- | -------- | -------------------------------------------- |
| `laravel_nginx`  | nginx:alpine              | `:8080`  | Servidor web Nginx                           |
| `laravel_php`    | php:8.3-fpm               | `:9000`  | PHP-FPM con extensiones para Laravel         |
| `laravel_mysql`  | mysql:8.0                 | `:3306`  | Base de datos MySQL                          |
| `laravel_phpmyadmin` | phpmyadmin:latest     | `:8081`  | Interfaz web para administrar MySQL          |
| `laravel_node`   | node:22-alpine            | —        | Compilación de assets con Vite / npm         |

---

## Funcionalidades

### Páginas públicas

| Ruta                    | Descripción                                      |
| ----------------------- | ------------------------------------------------ |
| `GET /`                 | **Homepage** — Banners, productos destacados, categorías |
| `GET /product/{slug}`   | **Producto** — Imagen, precio, talla/color, reseñas |
| `GET /category/{slug}`  | **Categoría** — Grid de productos con filtros y paginación |
| `GET /cart`             | **Carrito** — Vista del carrito de compras       |
| `POST /login`           | Inicio de sesión                                 |
| `POST /register`        | Registro de usuario                              |

### Frontend — Componentes React reutilizables

| Componente              | Ubicación                        | Propósito                        |
| ----------------------- | -------------------------------- | -------------------------------- |
| `BannerSlide`           | `Components/BannerSlider.jsx`    | Banner con texto posicionado     |
| `BannerGrid`            | `Components/BannerGrid.jsx`      | Grid 1 grande + 2 pequeños       |
| `Breadcrumb`            | `Components/Breadcrumb.jsx`      | Migas de pan navegacional        |
| `ProductTile`           | `Components/ProductTile.jsx`     | Tarjeta de producto en grid      |
| `ProductGrid`           | `Components/ProductGrid.jsx`     | Grid responsive de productos     |
| `ProductImageGallery`   | `Components/ProductImageGallery.jsx` | Galería de imágenes del producto |
| `ProductInfo`           | `Components/ProductInfo.jsx`     | Info detallada del producto      |
| `PriceDisplay`          | `Components/PriceDisplay.jsx`    | Precio normal + oferta           |
| `ColorSelector`         | `Components/ColorSelector.jsx`   | Selector de colores              |
| `SizeSelector`          | `Components/SizeSelector.jsx`    | Selector de tallas               |
| `AddToCartButton`       | `Components/AddToCartButton.jsx` | Botón añadir al carrito          |
| `StarRating`            | `Components/StarRating.jsx`      | Valoración por estrellas         |
| `ReviewCard`            | `Components/ReviewCard.jsx`      | Reseña individual                |
| `ReviewList`            | `Components/ReviewList.jsx`      | Lista de reseñas                 |
| `FeaturedProducts`      | `Components/FeaturedProducts.jsx`| Sección productos destacados     |
| `HomeCategories`        | `Components/HomeCategories.jsx`  | Grid de categorías en home       |
| `HeaderCart`            | `Components/HeaderCart.jsx`      | Icono carrito en cabecera        |

### Layouts

| Layout                     | Uso                                    |
| -------------------------- | -------------------------------------- |
| `Layouts/StoreLayout`      | Cabecera (logo, nav categorías, carrito/login) + contenido |
| `Layouts/AuthenticatedLayout` | Panel de administración con sidebar  |
| `Layouts/GuestLayout`      | Páginas de autenticación              |

### Estilos (SCSS)

Migrado de Tailwind CSS a SCSS personalizado. Sistema de diseño en `resources/scss/`:

| Archivo                  | Propósito                                |
| ------------------------ | ---------------------------------------- |
| `_variables.scss`        | Tokens de diseño (colores, sombras, radios, breakpoints) |
| `_base.scss`             | Estilos base (reset, tipografía)        |
| `_utilities.scss`        | Clases utilitarias (espaciado, display, flexbox) |
| `_components.scss`       | Estilos de componentes (botones, header, breadcrumb, grid, tiles, banners, categorías, filtros, paginación) |
| `_dark.scss`             | Modo oscuro                             |
| `app.scss`               | Punto de entrada (importa todos los anteriores) |

---

## 🗄️ Base de datos

### Migraciones

| Archivo                     | Tabla                 | Propósito                    |
| --------------------------- | --------------------- | ---------------------------- |
| `create_users_table`        | `users`               | Usuarios (admin/customer)    |
| `create_categories_table`   | `categories`          | Categorías jerárquicas (soft delete) |
| `create_products_table`     | `products`            | Productos (soft delete)      |
| `create_category_product_table` | `category_product` | Relación N:M productos-categorías |
| `create_product_images_table` | `product_images`    | Imágenes de productos        |
| `create_prices_table`       | `prices`              | Precios (standard/sale con fechas) |
| `create_carts_table`        | `carts`               | Carritos de compra           |
| `create_cart_items_table`   | `cart_items`          | Items en carrito             |
| `create_reviews_table`      | `reviews`             | Reseñas de productos         |
| `create_coupons_table`      | `coupons`             | Cupones de descuento         |
| `create_banners_table`      | `banners`             | Banners de la homepage       |
| `add_product_attributes`    | `products`            | Colores, tallas, guía de tallas |

### Seeders

```bash
docker compose exec php php artisan db:seed
```

Genera:
- 1 admin + 5 clientes
- 10 categorías (3 padres + 7 hijas)
- 50 productos con 2-4 imágenes cada uno, precios (standard + 20% con oferta)
- 4 banners con imágenes y posiciones variadas
- Cupones, reseñas y carrito de ejemplo

---

## Comandos comunes

### Artisan (dentro del contenedor PHP)

```bash
# Ejecutar migraciones
docker compose exec php php artisan migrate

# Revertir migraciones
docker compose exec php php artisan migrate:rollback

# Ejecutar seeders
docker compose exec php php artisan db:seed

# Crear un nuevo controlador / modelo
docker compose exec php php artisan make:controller ProductController
docker compose exec php php artisan make:model Product

# Limpiar cachés
docker compose exec php php artisan cache:clear
docker compose exec php php artisan config:clear
docker compose exec php php artisan view:clear
```

### Composer

```bash
# Instalar dependencias
docker compose exec php composer install

# Actualizar dependencias
docker compose exec php composer update

# Añadir un paquete
docker compose exec php composer require <paquete>
```

### NPM / Node.js

```bash
# Instalar dependencias frontend
docker compose exec node npm install

# Compilar assets para producción
docker compose exec node npm run build

# Compilar assets en modo desarrollo (vigilando cambios)
docker compose exec node npm run dev

# Añadir un paquete frontend
docker compose exec node npm install <paquete>
```

### Tests (PHPUnit)

```bash
# Ejecutar todos los tests
docker compose exec php php artisan test

# Ejecutar un archivo de test específico
docker compose exec php php artisan test --filter=ProductTest
```

### Docker Compose

```bash
# Iniciar servicios en segundo plano
docker compose up -d

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f php

# Detener servicios
docker compose down

# Detener servicios y eliminar volúmenes (pierde datos de BD)
docker compose down -v

# Reconstruir imágenes
docker compose build
```

---

## 📁 Estructura del proyecto

```
laravel_ecommerce/
├── .env                        # Variables de entorno
├── docker-compose.yml          # Configuración de servicios Docker
├── docker/
│   ├── nginx/
│   │   └── default.conf        # Configuración del servidor Nginx
│   └── php/
│       ├── Dockerfile          # Imagen PHP personalizada
│       └── php.ini             # Configuración de PHP
│
└── src/                        # Código fuente de Laravel
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/        # ProductController, CategoryController, HomeController, CartController
    │   │   └── Middleware/         # HandleInertiaRequests (comparte categorías globalmente)
    │   ├── Models/                 # Banner, Category, Product, Price, Cart, Review, Coupon…
    │   └── Providers/
    ├── config/
    ├── database/
    │   ├── factories/
    │   ├── migrations/             # 19 migraciones
    │   └── seeders/                # DatabaseSeeder, BannerSeeder
    ├── public/
    ├── resources/
    │   ├── js/
    │   │   ├── Components/         # 26 componentes React reutilizables
    │   │   ├── Layouts/            # StoreLayout, AuthenticatedLayout, GuestLayout
    │   │   └── Pages/              # Home, Products/Show, Categories/Show, Cart, Auth…
    │   ├── scss/                   # SCSS personalizado (sin Tailwind)
    │   │   ├── _variables.scss     # Tokens de diseño
    │   │   ├── _base.scss          # Reset y tipografía
    │   │   ├── _utilities.scss     # Clases utilitarias
    │   │   ├── _components.scss    # ~1600 líneas de estilos de componentes
    │   │   ├── _dark.scss          # Modo oscuro
    │   │   └── app.scss            # Punto de entrada
    │   └── views/                  # Blade (app.blade.php para Inertia)
    ├── routes/
    │   ├── web.php                 # Rutas públicas (home, producto, categoría, carrito, auth)
    │   ├── api.php
    │   └── auth.php                # Rutas Breeze
    ├── tests/                      # Features/ — tests de productos, categorías, precios
    ├── composer.json
    ├── package.json
    └── vite.config.js
```


---

## Autenticación

Este proyecto incluye **Laravel Breeze** con **Inertia.js** + **React** para el scaffolding de autenticación:

- Registro de usuarios
- Inicio de sesión
- Restablecimiento de contraseña
- Verificación de correo electrónico
- Perfil de usuario

---

## 🧪 Tests

```bash
# Ejecutar todos los tests
docker compose exec php php artisan test

# Tests específicos
docker compose exec php php artisan test --filter=ProductTest
docker compose exec php php artisan test --filter=CategoryTest
```

Actualmente **51 tests** que cubren modelos, relaciones y scopes de:
- Productos (activos, precios, imágenes)
- Categorías (jerarquía, descendientes)
- Precios (tipos standard/sale, fechas)
- Carritos, reseñas, cupones

---

## Notas técnicas

### SCSS en lugar de Tailwind

Tailwind CSS fue eliminado del proyecto. Se usa SCSS personalizado con:
- Un sistema de tokens de diseño en `_variables.scss`
- Mixin responsive con breakpoints estándar (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Clases utilitarias equivalentes a las de Tailwind (`flex`, `grid`, `hidden`, `m-*`, `p-*`, etc.)
- Soporte completo de modo oscuro

### Precios como entidad separada

Los precios no están en la tabla `products`. Existe una tabla `prices` separada con:
- `type`: `standard` (precio normal) o `sale` (precio de oferta)
- `starts_at` / `ends_at`: fechas de vigencia para ofertas
- Una relación `HasOne` con constraints de fechas para el precio activo y de oferta

### Serialización de Inertia

Laravel serializa las relaciones Eloquent en **snake_case** en las respuestas JSON/Inertia, incluso si los métodos PHP usan camelCase. Ejemplo:
- PHP: `$product->activePrice()` → JS: `product.active_price`
- PHP: `$product->salePrice()` → JS: `product.sale_price`

---

## 🧪 Desarrollo

```bash
docker compose exec node npm run dev
```

### Acceder a la terminal del contenedor PHP

```bash
docker compose exec -it php bash
```

### Acceder a la terminal de Node.js

```bash
docker compose exec -it node sh
```

---

## Mantenimiento

```bash
# Detener todo y liberar recursos
docker compose down

# Limpiar volúmenes de Docker (cuidado: elimina datos de BD)
docker compose down -v
docker volume prune -f
```
