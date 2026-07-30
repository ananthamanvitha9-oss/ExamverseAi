#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Preparing SQLite database..."
touch database/database.sqlite
chmod 777 database/database.sqlite

echo "Running migrations..."
php artisan migrate --force

echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build complete."
