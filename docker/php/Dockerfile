FROM php:8.3-fpm

# Arguments
ARG USER=laravel
ARG UID=1000

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libicu-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP Extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user
RUN useradd -m -u ${UID} -s /bin/bash ${USER}

# Set working directory
WORKDIR /var/www/html

USER ${USER}

EXPOSE 9000

CMD ["php-fpm"]
