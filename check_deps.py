import importlib
import sys

dependencies = [
    'langchain_openai',
    'langchain_groq',
    'openai',
    'flask',
    'pylint',
    'langsmith'
]

print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

for dep in dependencies:
    try:
        importlib.import_module(dep)
        print(f"SUCCESS: {dep} is correctly installed.")
    except ImportError:
        print(f"MISSING: {dep} is NOT installed.")
