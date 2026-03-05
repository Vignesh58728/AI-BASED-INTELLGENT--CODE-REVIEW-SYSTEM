import asyncio
import os
import sys
import tempfile
import httpx
import base64
import subprocess
from app.core.config import settings

# Judge0 Language IDs
LANGUAGE_IDS = {
    "python": 71,
    "java": 62,
    "c": 50,
    "cpp": 54,
    "c++": 54,
    "c#": 51,
    "csharp": 51,
    "javascript": 63,
}

RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com"

def safe_print(msg: str):
    """Helper to print non-ASCII content safely to Windows terminals."""
    try:
        print(msg)
    except UnicodeEncodeError:
        try:
            print(msg.encode(sys.stdout.encoding or 'ascii', errors='replace').decode(sys.stdout.encoding or 'ascii'))
        except:
            print("[UNPRINTABLE CONTENT]")

async def execute_code(code: str, language: str) -> dict:
    """Executes code using local compilers if available, otherwise falls back to Judge0."""
    try:
        language = (language or "python").strip().lower()
        print(f"DEBUG: executor.execute_code called with language='{language}'")
        
        # Try local execution first for Python
        if language == "python":
            print("DEBUG: entering _run_python")
            return await _run_python(code)
        
        # Try local execution for JavaScript if node is available
        if language == "javascript":
            print("DEBUG: entering _run_javascript")
            return await _run_javascript(code)

        # For other languages, try Judge0 if API key is present
        if settings.JUDGE0_API_KEY and language not in ["html", "css"]:
            try:
                judge_res = await _run_judge0(code, language)
                if judge_res.get("status") != "error" or "subscribed" not in str(judge_res.get("error")):
                    return judge_res
            except Exception as e:
                safe_print(f"Judge0 connection failed: {str(e)}")
            
        # Local fallback if no API key or Judge0 fails
        if language in ["c", "cpp", "c++"]:
            return await _run_c_cpp(code, language)
        elif language == "java":
            return await _run_java(code)
        elif language in ["c#", "csharp"]:
            return await _run_csharp(code)
        else:
            return {
                "output": "",
                "error": f"Execution for {language} failed locally and Judge0 is unavailable.",
                "status": "error"
            }
    except Exception as e:
        import traceback
        err_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
        safe_print(f"CRITICAL ERROR IN EXECUTOR:\n{err_msg}")
        return {
            "output": "",
            "error": f"Server Execution Error: {str(e)}",
            "status": "error"
        }

async def _run_judge0(code: str, language: str) -> dict:
    lang_id = LANGUAGE_IDS.get(language)
    if not lang_id:
        return {"output": "", "error": f"Language {language} not supported by Judge0 mapping.", "status": "error"}

    url = f"https://{RAPIDAPI_HOST}/submissions"
    params = {"base64_encoded": "true", "wait": "true"}
    headers = {
        "x-rapidapi-key": settings.JUDGE0_API_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        "Content-Type": "application/json"
    }
    
    encoded_code = base64.b64encode(code.encode('utf-8')).decode('utf-8')
    payload = {
        "language_id": lang_id,
        "source_code": encoded_code,
        "stdin": ""
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers, params=params, timeout=10.0)
            if response.status_code != 201:
                return {"output": "", "error": f"Judge0 API Error: {response.text}", "status": "error"}
            
            data = response.json()
            stdout = base64.b64decode(data.get("stdout") or "").decode('utf-8', errors='replace')
            stderr = base64.b64decode(data.get("stderr") or "").decode('utf-8', errors='replace')
            compile_output = base64.b64decode(data.get("compile_output") or "").decode('utf-8', errors='replace')
            
            error_msg = stderr or compile_output
            status = "success" if data.get("status", {}).get("id") == 3 else "error"
            
            return {
                "output": stdout,
                "error": error_msg,
                "status": status
            }
    except Exception as e:
        return {"output": "", "error": f"Judge0 Connection Error: {str(e)}", "status": "error"}

async def _run_python(code: str) -> dict:
    try:
        tmp = tempfile.NamedTemporaryFile(suffix=".py", delete=False)
        tmp.write(code.encode('utf-8'))
        tmp.close()
        tmp_path = tmp.name
    except Exception as e:
        return {"output": "", "error": f"Failed to create temp file: {str(e)}", "status": "error"}

    try:
        executables = [sys.executable, "python", "python3"]
        last_error = "None"
        
        for exe in executables:
            try:
                def sync_run():
                    return subprocess.run(
                        [exe, tmp_path],
                        capture_output=True,
                        text=False,
                        env={**os.environ, "PYTHONIOENCODING": "utf-8"},
                        timeout=5.0
                    )

                result = await asyncio.to_thread(sync_run)
                return _parse_result(result, tmp_path)
            except subprocess.TimeoutExpired:
                return {"output": "", "error": "Execution Timeout (5s limit)", "status": "timeout"}
            except Exception as e:
                last_error = f"{type(e).__name__}: {str(e)}"
                continue
                
        return {"output": "", "error": f"Failed to start Python process. Tested: {executables}. Last error: {last_error}", "status": "error"}
    finally:
        _cleanup(tmp_path)

async def _run_javascript(code: str) -> dict:
    try:
        tmp = tempfile.NamedTemporaryFile(suffix=".js", delete=False)
        tmp.write(code.encode('utf-8'))
        tmp.close()
        tmp_path = tmp.name
    except Exception as e:
        return {"output": "", "error": f"Failed to create temp file: {str(e)}", "status": "error"}

    try:
        executables = ["node", "nodejs"]
        last_error = "Node.js not found in path"
        
        for exe in executables:
            try:
                def sync_run():
                    return subprocess.run(
                        [exe, tmp_path],
                        capture_output=True,
                        text=False,
                        timeout=5.0
                    )

                result = await asyncio.to_thread(sync_run)
                return _parse_result(result, tmp_path)
            except subprocess.TimeoutExpired:
                return {"output": "", "error": "Execution Timeout (5s limit)", "status": "timeout"}
            except Exception as e:
                last_error = f"{type(e).__name__}: {str(e)}"
                continue
        
        return {"output": "", "error": f"JavaScript execution failed. {last_error}", "status": "error"}
    finally:
        _cleanup(tmp_path)

async def _run_c_cpp(code: str, lang: str) -> dict:
    suffix = ".c" if lang == "c" else ".cpp"
    compiler = "gcc" if lang == "c" else "g++"
    
    try:
        tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        tmp.write(code.encode('utf-8'))
        tmp.close()
        src_path = tmp.name
    except Exception as e:
        return {"output": "", "error": f"Failed to create temp file: {str(e)}", "status": "error"}
    
    exe_path = src_path + (".exe" if os.name == 'nt' else ".out")
    
    try:
        # Compile
        def sync_compile():
            return subprocess.run(
                [compiler, src_path, "-o", exe_path],
                capture_output=True,
                text=False,
                timeout=5.0
            )
        
        compile_res = await asyncio.to_thread(sync_compile)
        
        if compile_res.returncode != 0:
            return {"output": "", "error": compile_res.stderr.decode('utf-8', errors='replace'), "status": "error"}
        
        # Run
        def sync_run():
            return subprocess.run(
                [exe_path],
                capture_output=True,
                text=False,
                timeout=5.0
            )

        run_res = await asyncio.to_thread(sync_run)
        return _parse_result(run_res, src_path)
    except Exception as e:
        return {"output": "", "error": f"Compiler/Runtime Error: {str(e)}", "status": "error"}
    finally:
        _cleanup(src_path)
        _cleanup(exe_path)

async def _run_java(code: str) -> dict:
    with tempfile.TemporaryDirectory() as tmpdir:
        src_path = os.path.join(tmpdir, "Main.java")
        with open(src_path, "w", encoding="utf-8") as f:
            f.write(code)
        
        try:
            # Compile
            def sync_compile():
                return subprocess.run(
                    ["javac", src_path],
                    capture_output=True,
                    timeout=5.0
                )
            
            compile_res = await asyncio.to_thread(sync_compile)
            
            if compile_res.returncode != 0:
                return {"output": "", "error": compile_res.stderr.decode('utf-8', errors='replace'), "status": "error"}
            
            # Run
            def sync_run():
                return subprocess.run(
                    ["java", "-cp", tmpdir, "Main"],
                    capture_output=True,
                    timeout=5.0
                )

            run_res = await asyncio.to_thread(sync_run)
            return _parse_result(run_res, "Main.java")
        except Exception as e:
            return {"output": "", "error": f"Java Runtime Error: {str(e)}", "status": "error"}

async def _run_csharp(code: str) -> dict:
    compiler = "csc" if os.name == 'nt' else "mcs"
    try:
        tmp = tempfile.NamedTemporaryFile(suffix=".cs", delete=False)
        tmp.write(code.encode('utf-8'))
        tmp.close()
        src_path = tmp.name
    except Exception as e:
        return {"output": "", "error": f"Failed to create temp file: {str(e)}", "status": "error"}
    
    exe_path = src_path.replace(".cs", ".exe")
    
    try:
        # Compile
        def sync_compile():
            args = [compiler, "/out:" + exe_path, src_path] if os.name == 'nt' else [compiler, src_path]
            return subprocess.run(args, capture_output=True, timeout=5.0)
            
        compile_res = await asyncio.to_thread(sync_compile)
        
        if compile_res.returncode != 0:
            return {"output": "", "error": compile_res.stderr.decode('utf-8', errors='replace'), "status": "error"}
        
        # Run
        def sync_run():
            return subprocess.run([exe_path], capture_output=True, timeout=5.0)

        run_res = await asyncio.to_thread(sync_run)
        return _parse_result(run_res, src_path)
    except Exception as e:
        return {"output": "", "error": f"C# Runtime Error: {str(e)}", "status": "error"}
    finally:
        _cleanup(src_path)
        _cleanup(exe_path)

def _parse_result(result, path):
    stdout_str = result.stdout.decode('utf-8', errors='replace')
    stderr_str = result.stderr.decode('utf-8', errors='replace').replace(path, "main")
    
    return {
        "output": stdout_str,
        "error": stderr_str,
        "exit_code": result.returncode,
        "status": "success" if result.returncode == 0 else "error"
    }

def _cleanup(path):
    if path and os.path.exists(path):
        try: os.remove(path)
        except: pass
