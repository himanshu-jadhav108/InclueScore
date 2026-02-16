#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Run migrations if needed
# python database.py  # Uncomment if needed

# Start the application
gunicorn main:app \
    --worker-class uvicorn.workers.UvicornWorker \
    --workers 4 \
    --bind 0.0.0.0:$PORT \
    --timeout 120