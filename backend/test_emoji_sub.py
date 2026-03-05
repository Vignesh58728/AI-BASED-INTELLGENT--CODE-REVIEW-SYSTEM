import asyncio
import sys
import os

async def test_emoji():
    exe = sys.executable
    code = 'print("Hello 🐍")'
    tmp_path = "test_emoji.py"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(code)
    
    print(f"Testing with: {exe}")
    try:
        process = await asyncio.create_subprocess_exec(
            exe, tmp_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"}
        )
        stdout, stderr = await process.communicate()
        print(f"Success! Return code: {process.returncode}")
        # Try to decode with replace
        print(f"STDOUT: {stdout.decode('utf-8', errors='replace')}")
        print(f"STDERR: {stderr.decode('utf-8', errors='replace')}")
    except Exception as e:
        print(f"FAILED with exception type: {type(e)}")
        print(f"Error message: '{str(e)}'")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(test_emoji())
