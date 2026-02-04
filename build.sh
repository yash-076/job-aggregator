#!/bin/bash
set -e

echo "Running database initialization..."
cd backend
python -m app.core.init_db

echo "Build complete!"
