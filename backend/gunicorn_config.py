import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', 8000)}"
backlog = 2048
max_requests = 1000
max_requests_jitter = 50
timeout = 120
keepalive = 5

# Worker processes
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
preload_app = False
daemon = False

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Server mechanics
preload_app = True
proxy_protocol = True