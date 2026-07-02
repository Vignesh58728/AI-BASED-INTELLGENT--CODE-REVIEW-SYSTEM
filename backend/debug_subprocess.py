import asyncio
import sys
import os

async def test_subprocess():
    exe = sys.executable
    print(f"Testing with: {exe}")
    try:
        process = await asyncio.create_subprocess_exec(
            exe, "--version",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        print(f"Success! Return code: {process.returncode}")
        print(f"STDOUT: {stdout.decode()}")
        print(f"STDERR: {stderr.decode()}")
    except Exception as e:
        print(f"FAILED with exception type: {type(e)}")
        print(f"Error message: '{str(e)}'")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(test_subprocess())
