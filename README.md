# Laravel Ecommerce

Plataforma de comercio electrónico construida con **Laravel 13**, **Inertia.js** y **React**, completamente dockerizada para un desarrollo rápido y consistente.

---

## Requisitos

- **Docker Desktop** (o Docker Engine + Docker Compose)
- No requiere PHP, Composer ni Node.js instalados en el equipo anfitrión

---

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio> laravel_ecommerce
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

# 8. ¡Listo! Abrir http://localhost:8000
```

---

## URLs de los servicios

| Servicio     | URL                          | Descripción                     |
| ------------ | ---------------------------- | ------------------------------- |
| **Aplicación** | http://localhost:8000       | Frontend Laravel + React        |
| **phpMyAdmin** | http://localhost:8080       | Gestor de base de datos MySQL   |
| **MySQL**      | localhost:3306             | Conexión directa a la BD        |

### Credenciales por defecto

| Servicio    | Usuario      | Contraseña | Base de datos       |
| ----------- | ------------ | ---------- | ------------------- |
| MySQL       | `laravel`    | `root`     | `laravel_ecommerce` |
| MySQL (root)| `root`       | `root`     | `laravel_ecommerce` |
| phpMyAdmin  | `root`       | `root`      | —                   |

> **Nota:** Las credenciales se pueden modificar en el archivo `.env`.

---

## Servicios Docker

| Contenedor       | Imagen                    | Puerto  | Descripción                                  |
| ---------------- | ------------------------- | ------- | -------------------------------------------- |
| `laravel_nginx`  | nginx:alpine              | `:8000` | Servidor web Nginx                           |
| `laravel_php`    | php:8.3-fpm               | `:9000` | PHP-FPM con extensiones para Laravel         |
| `laravel_mysql`  | mysql:8.0                 | `:3306` | Base de datos MySQL                          |
| `laravel_phpmyadmin` | phpmyadmin:latest     | `:8080` | Interfaz web para administrar MySQL          |
| `laravel_node`   | node:22-alpine            | —       | Compilación de assets con Vite / npm         |

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
├── .env                    # Variables de entorno
├── docker-compose.yml      # Configuración de servicios Docker
├── docker/
│   ├── nginx/
│   │   └── default.conf    # Configuración del servidor Nginx
│   └── php/
│       ├── Dockerfile      # Imagen PHP personalizada
│       └── php.ini         # Configuración de PHP
│
└── src/                    # Código fuente de Laravel (montado en /var/www/html)
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/    # Controladores HTTP
    │   │   └── Middleware/     # Middleware personalizado
    │   ├── Models/             # Modelos Eloquent
    │   └── Providers/         # Proveedores de servicios
    ├── bootstrap/
    ├── config/             # Archivos de configuración
    │   ├── app.php         # Configuración general
    │   ├── database.php    # Configuración de base de datos
    │   └── ...
    ├── database/
    │   ├── factories/      # Factories para datos de prueba
    │   ├── migrations/     # Migraciones de base de datos
    │   └── seeders/        # Pobladores de datos
    ├── public/             # Directorio público (punto de entrada)
    │   └── index.php       # Front controller
    ├── resources/
    │   ├── js/             # Componentes React + Inertia
    │   │   ├── Components/ # Componentes reutilizables
    │   │   ├── Layouts/    # Layouts de la aplicación
    │   │   └── Pages/      # Páginas Inertia
    │   └── views/          # Vistas Blade (si se requieren)
    ├── routes/
    │   ├── web.php         # Rutas web (Inertia)
    │   ├── api.php         # Rutas API
    │   └── auth.php        # Rutas de autenticación (Breeze)
    ├── storage/            # Almacenamiento (logs, caché, sesiones)
    ├── tests/              # Tests con PHPUnit
    ├── composer.json       # Dependencias PHP
    ├── package.json        # Dependencias JavaScript
    └── vite.config.js      # Configuración de Vite
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

## 🧪 Desarrollo

### Recompilar assets al momento

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
