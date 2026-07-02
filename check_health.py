import httpx
import asyncio

async def check():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get("http://localhost:5001/health")
            print(f"Health: {resp.status_code}")
            print(resp.json())
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
