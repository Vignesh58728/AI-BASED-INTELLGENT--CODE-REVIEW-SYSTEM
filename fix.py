import re

with open('backend/app/services/llm_service.py', 'r') as f:
    content = f.read()

helper = """
async def _get_completion_text(messages: list, temperature: float = 0.3) -> str:
    if settings.GROQ_API_KEY:
        from groq import AsyncGroq
        _client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        completion = await _client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=temperature
        )
        return completion.choices[0].message.content.strip()
    elif settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        completion = await _client.chat.completions.create(
            messages=messages,
            model=DEFAULT_MODEL,
            temperature=temperature
        )
        return completion.choices[0].message.content.strip()
    else:
        raise ValueError("API not configured")
"""

# insert helper before get_suggestions
if 'async def _get_completion_text' not in content:
    content = content.replace('async def get_suggestions', helper + '\nasync def get_suggestions')

pattern = re.compile(
    r'completion = await client\.chat\.completions\.create\(\s*messages=messages,\s*model=[^,]+,\s*temperature=([0-9\.]+)\s*\)\s*(raw_content|response_text|data) = completion\.choices\[0\]\.message\.content\.strip\(\)',
    re.DOTALL
)

content = pattern.sub(r'\2 = await _get_completion_text(messages, temperature=\1)', content)

with open('backend/app/services/llm_service.py', 'w') as f:
    f.write(content)
