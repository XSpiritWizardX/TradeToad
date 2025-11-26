import os

# Read from env so keys aren't hardcoded in source
API_KEY = os.getenv("POLYGON_API_KEY", "")
