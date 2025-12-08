#!/bin/bash
set -e

# This script runs during container initialization

echo "Initializing TimescaleDB..."

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready!"

# Run initialization SQL
if [ -f /docker-entrypoint-initdb.d/init.sql ]; then
    echo "Running init.sql..."
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/init.sql
    echo "Database initialized successfully!"
fi

echo "TimescaleDB setup complete!"
