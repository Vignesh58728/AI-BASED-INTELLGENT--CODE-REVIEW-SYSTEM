from app.main import app
import sys
import os

def list_routes():
    for route in app.routes:
        methods = getattr(route, "methods", "N/A")
        print(f"Path: {route.path} | Methods: {methods}")

if __name__ == "__main__":
    list_routes()
