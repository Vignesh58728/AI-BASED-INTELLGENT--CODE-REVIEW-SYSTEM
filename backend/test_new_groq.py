
import asyncio
import httpx

async def test():
    key = "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"
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {key}"},
            json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": "Hi"}]}
        )
        print(resp.status_code, resp.text[:500])

if __name__ == "__main__":
    asyncio.run(test())
