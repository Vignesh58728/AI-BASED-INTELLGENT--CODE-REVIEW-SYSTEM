
import subprocess
import sys
import tempfile
import os

async def execute_python_code(code: str) -> dict:
    """Executes Python code in a subprocess and returns output/errors."""
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tmp:
        tmp.write(code.encode('utf-8'))
        tmp_path = tmp.name

    try:
        # Run the code with a timeout to prevent infinite loops
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        # Clean up error message to remove temp paths
        error_output = result.stderr
        if error_output:
            error_output = error_output.replace(tmp_path, "main.py")

        return {
            "output": result.stdout,
            "error": error_output,
            "exit_code": result.returncode,
            "status": "success" if result.returncode == 0 else "error"
        }
    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out (5s limit). Check for infinite loops.",
            "exit_code": -1,
            "status": "timeout"
        }
    except Exception as e:
        return {
            "output": "",
            "error": str(e),
            "exit_code": -1,
            "status": "exception"
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
