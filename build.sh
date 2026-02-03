#!/bin/bash
set -e

echo "Running database migrations..."
cd backend
python -m app.core.init_db

echo "Build complete!"
