import asyncio
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.db.session import init_db
from app.api.problems import router
import traceback

app = FastAPI()
app.include_router(router, prefix='/api/problems')

async def main():
    await init_db()
    # TestClient in async context can be tricky to run async code inside routes if not using AsyncClient
    # But for a simple test, let's just use AsyncClient
    from httpx import AsyncClient, ASGITransport
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        try:
            res = await ac.get("/api/problems/school")
            print("Status:", res.status_code)
            if res.status_code == 500:
                print("TEXT ERROR RESPONSE:", res.text)
            else:
                print("Length of json:", len(res.json()))
        except Exception as e:
            traceback.print_exc()

asyncio.run(main())
