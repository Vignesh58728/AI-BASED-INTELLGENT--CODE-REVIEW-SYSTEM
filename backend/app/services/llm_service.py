import ast
import json
from typing import Any, Dict, List, Optional, Tuple

import httpx
from groq import AsyncGroq

from app.core.config import settings
from app.schemas.ai import (
    AIGeneratedQuestionResponse,
    AIChatRequest,
    AIChatResponse,
    AIChatSource,
)
from app.schemas.ai_review import ExplainRequest, ExplainResponse, SuggestionResponse


client = AsyncGroq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"

MODEL_PROVIDER_MAP: Dict[str, Tuple[str, str]] = {
    "default": ("google", "gemini-2.0-flash"),
    "llama 3.3": ("groq", DEFAULT_GROQ_MODEL),
    "deepseek-v3": ("deepseek", "deepseek-chat"),
    "gpt-oss-120b": ("cerebras", "gpt-oss-120b"),
    "gemini 2.0 flash": ("google", "gemini-2.0-flash"),
    "gpt-4o": ("openai", "gpt-4o"),
}

PROVIDER_SYSTEM_PROMPTS: Dict[str, str] = {
    "groq": (
        "You are an expert code tutor for students. Give clear step-by-step reasoning, "
        "explain tradeoffs, and avoid handing out full solutions unless the user asks."
    ),
    "deepseek": (
        "You are a competitive-programming and systems mentor. Focus on algorithmic rigor, "
        "edge cases, and efficient implementation choices."
    ),
    "gemini": (
        "You are a curriculum-aware coding tutor. Explain in simple language first, then add "
        "advanced depth as needed."
    ),
    "cerebras": (
        "You are a fast and intelligent coding mentor. Provide extremely low-latency, "
        "precise, and high-quality programming guidance."
    ),
    "google": (
        "You are an advanced AI tutor powered by Gemini 2.0 Flash. Provide deep insights, "
        "clear code explanations, and helpful hints while maintaining ultra-fast responses."
    ),
    "openai": (
        "You are a sophisticated AI code instructor. Provide detailed, structured, "
        "and highly accurate line-by-line explanations of complex programming logic."
    ),
}

FALLBACK_ORDER: List[Tuple[str, str]] = [
    ("google", "gemini-2.0-flash"),
    ("groq", DEFAULT_GROQ_MODEL),
    ("cerebras", "gpt-oss-120b"),
]


def _provider_key(provider: str) -> Optional[str]:
    key_map = {
        "groq": settings.GROQ_API_KEY,
        "openai": settings.OPENAI_API_KEY,
        "anthropic": settings.ANTHROPIC_API_KEY,
        "deepseek": settings.DEEPSEEK_API_KEY,
        "gemini": settings.GEMINI_API_KEY,
        "perplexity": settings.PERPLEXITY_API_KEY,
        "cerebras": settings.CEREBRAS_API_KEY,
        "google": settings.GOOGLE_API_KEY,
    }
    return key_map.get(provider)


def _resolve_provider(model_name: Optional[str], use_web_search: bool) -> Tuple[str, str]:
    normalized = (model_name or "default").strip().lower()
    provider, model = MODEL_PROVIDER_MAP.get(normalized, MODEL_PROVIDER_MAP["default"])

    if _provider_key(provider):
        return provider, model

    for fallback_provider, fallback_model in FALLBACK_ORDER:
        if _provider_key(fallback_provider):
            return fallback_provider, fallback_model

    return "none", "none"


def _safe_history(history: List[dict]) -> List[dict]:
    cleaned: List[dict] = []
    for item in history[-12:]:
        role = str(item.get("role", "")).strip().lower()
        content = str(item.get("content", "")).strip()
        if role in {"user", "assistant"} and content:
            cleaned.append({"role": role, "content": content})
    return cleaned


def _build_messages(request: AIChatRequest, provider: str) -> List[Dict[str, str]]:
    system_prompt = PROVIDER_SYSTEM_PROMPTS.get(provider, PROVIDER_SYSTEM_PROMPTS["groq"])
    language_instruction = (
        "Respond in Tamil." if (request.language_hint or "").strip().lower() == "tamil" else "Respond in English."
    )
    messages: List[Dict[str, str]] = [{"role": "system", "content": f"{system_prompt} {language_instruction}"}]
    messages.extend(_safe_history(request.history))

    user_content = request.query.strip()
    if request.file_context:
        user_content = f"{user_content}\n\nAttached file/snippet context:\n{request.file_context.strip()}"

    messages.append({"role": "user", "content": user_content})
    return messages


async def _chat_openai_compatible(
    *,
    base_url: str,
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
) -> Tuple[str, List[AIChatSource]]:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages}
    async with httpx.AsyncClient(timeout=35) as http:
        response = await http.post(f"{base_url}/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"]
    sources = [AIChatSource(title="AI Generated", url="#")]
    return content, sources


async def _chat_groq(messages: List[Dict[str, str]], model: str) -> Tuple[str, List[AIChatSource]]:
    if client is None:
        raise RuntimeError("GROQ_API_KEY is missing.")
    completion = await client.chat.completions.create(messages=messages, model=model)
    answer = completion.choices[0].message.content
    return answer, [AIChatSource(title="AI Generated", url="#")]


async def _chat_anthropic(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    system = next((m["content"] for m in messages if m["role"] == "system"), "")
    chat_messages = [m for m in messages if m["role"] in {"user", "assistant"}]
    payload = {
        "model": model,
        "max_tokens": 1024,
        "system": system,
        "messages": chat_messages,
    }
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    async with httpx.AsyncClient(timeout=35) as http:
        response = await http.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    blocks = data.get("content", [])
    text_parts = [block.get("text", "") for block in blocks if block.get("type") == "text"]
    answer = "\n".join([part for part in text_parts if part]).strip()
    return answer or "No response received.", [AIChatSource(title="AI Generated", url="#")]


async def _chat_gemini(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    system = next((m["content"] for m in messages if m["role"] == "system"), "")
    conversation = [m for m in messages if m["role"] in {"user", "assistant"}]
    contents: List[Dict[str, Any]] = []
    for msg in conversation:
        role = "user" if msg["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})

    payload = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.4},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    async with httpx.AsyncClient(timeout=35) as http:
        response = await http.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

    candidates = data.get("candidates", [])
    if not candidates:
        return "No response received.", [AIChatSource(title="AI Generated", url="#")]

    parts = candidates[0].get("content", {}).get("parts", [])
    answer = "\n".join([part.get("text", "") for part in parts if part.get("text")]).strip()
    return answer or "No response received.", [AIChatSource(title="AI Generated", url="#")]


async def _chat_perplexity(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages}
    async with httpx.AsyncClient(timeout=35) as http:
        response = await http.post("https://api.perplexity.ai/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    answer = data["choices"][0]["message"]["content"]
    citations = data.get("citations", []) or []
    sources: List[AIChatSource] = []
    for idx, url in enumerate(citations[:6]):
        sources.append(AIChatSource(title=f"Source {idx + 1}", url=url))
    if not sources:
        sources = [AIChatSource(title="AI Generated", url="#")]
    return answer, sources


async def _chat_google_genai(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    from google import genai
    from google.genai import types
    
    client = genai.Client(api_key=api_key)
    
    # Extract system prompt and conversation history
    system_prompt = next((m["content"] for m in messages if m["role"] == "system"), "")
    chat_history = [m for m in messages if m["role"] in {"user", "assistant"}]
    
    # Prepare Gemini-compatible history
    contents: List[types.Content] = []
    for msg in chat_history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
    
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.7,
    )
    
    response = await client.aio.models.generate_content(
        model=model,
        contents=contents,
        config=config
    )
    
    answer = response.text or "No response received."
    return answer, [AIChatSource(title="AI Generated", url="#")]


def _suggested_questions(provider: str) -> List[str]:
    if provider == "perplexity":
        return [
            "Can you summarize the sources?",
            "Which source is most reliable?",
            "Give me an updated example with citations",
        ]
    return [
        "Explain this with a simple example",
        "What are common mistakes here?",
        "Give me a short practice task",
    ]


async def _get_adhoc_google_response(messages: List[Dict[str, str]], json_mode: bool = False) -> str:
    """Internal helper for specialized Gemini 2.0 requirements."""
    if not settings.GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY is missing for default Gemini operations.")
    
    from google import genai
    from google.genai import types
    
    genai_client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    
    system_prompt = next((m["content"] for m in messages if m["role"] == "system"), "")
    chat_history = [m for m in messages if m["role"] in {"user", "assistant"}]
    
    contents: List[types.Content] = []
    for msg in chat_history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
    
    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.4,
    )
    if json_mode:
        config.response_mime_type = "application/json"
    
    response = await genai_client.aio.models.generate_content(
        model="gemini-2.0-flash",
        contents=contents,
        config=config
    )
    return response.text or ""


async def get_chat_response(request: AIChatRequest) -> AIChatResponse:
    provider, model = _resolve_provider(request.model, request.use_web_search)
    if provider == "none":
        return AIChatResponse(
            answer="No LLM API key is configured on the server. Add at least one provider key in backend .env.",
            sources=[AIChatSource(title="Configuration Required", url="#")],
            suggested_questions=["How do I set the .env keys?", "Which provider should I start with?"],
            status="failed",
        )

    messages = _build_messages(request, provider)

    try:
        if provider == "groq":
            answer, sources = await _chat_groq(messages, model)
        elif provider == "openai":
            answer, sources = await _chat_openai_compatible(
                base_url="https://api.openai.com/v1",
                api_key=settings.OPENAI_API_KEY or "",
                model=model,
                messages=messages,
            )
        elif provider == "deepseek":
            answer, sources = await _chat_openai_compatible(
                base_url="https://api.deepseek.com",
                api_key=settings.DEEPSEEK_API_KEY or "",
                model=model,
                messages=messages,
            )
        elif provider == "anthropic":
            answer, sources = await _chat_anthropic(messages, model, settings.ANTHROPIC_API_KEY or "")
        elif provider == "gemini":
            answer, sources = await _chat_gemini(messages, model, settings.GEMINI_API_KEY or "")
        elif provider == "perplexity":
            answer, sources = await _chat_perplexity(messages, model, settings.PERPLEXITY_API_KEY or "")
        elif provider == "cerebras":
            answer, sources = await _chat_openai_compatible(
                base_url="https://api.cerebras.ai/v1",
                api_key=settings.CEREBRAS_API_KEY or "",
                model=model,
                messages=messages,
            )
        elif provider == "google":
            answer, sources = await _chat_google_genai(messages, model, settings.GOOGLE_API_KEY or "")
        else:
            answer, sources = await _chat_groq(messages, DEFAULT_GROQ_MODEL)
    except Exception as exc:
        return AIChatResponse(
            answer=f"Failed to get AI response from provider '{provider}': {exc}",
            sources=[AIChatSource(title="Provider Error", url="#")],
            suggested_questions=["Try another model", "Check the API key", "Disable web search and retry"],
            status="failed",
        )

    return AIChatResponse(
        answer=answer,
        sources=sources,
        suggested_questions=_suggested_questions(provider),
        status="completed",
    )


async def explain_code(request: ExplainRequest) -> ExplainResponse:
    """Provides a detailed line-by-line explanation of code logic."""
    # Use the requested model if provided, else default
    model_to_use = request.model or "default"
    
    # Reuse AIChatRequest logic to leverage the existing provider resolution
    chat_request = AIChatRequest(
        query=(
            f"Explain this {request.language} code logic step-by-step and line-by-line. "
            "Help me understand the algorithm and flow. "
            "IMPORTANT: Do NOT give me the corrected code or the full solution. "
            "Just explain the logic. Use markdown formatting with code highlights."
        ),
        model=model_to_use,
        file_context=f"Language: {request.language}\nCode to Explain:\n{request.code}",
        history=[],
        language_hint="english"
    )
    
    try:
        chat_response = await get_chat_response(chat_request)
        if chat_response.status == "failed":
            return ExplainResponse(explanation=chat_response.answer, status="failed")
            
        return ExplainResponse(explanation=chat_response.answer, status="completed")
    except Exception as e:
        return ExplainResponse(explanation=f"Explanation failed: {str(e)}", status="failed")


async def get_suggestions(request: ExplainRequest) -> SuggestionResponse:
    """Provides real AI code completions using Gemini 2.0 Flash."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert coder. Provide 2-3 natural, short, one-line code completions for "
                "the provided snippet. Return ONLY the code completions, one per line. No markdown, "
                "no quotes, no dashes, no list formatting like []."
            ),
        },
        {"role": "user", "content": f"Snippet:\n{request.code}"},
    ]
    raw_content = await _get_adhoc_google_response(messages)
    raw_content = raw_content.strip()
    suggestions: List[str] = []

    if raw_content.startswith("[") and raw_content.endswith("]"):
        try:
            parsed_list = ast.literal_eval(raw_content)
            if isinstance(parsed_list, list):
                suggestions = [str(item).strip() for item in parsed_list][:3]
        except Exception:
            pass

    if not suggestions:
        for line in raw_content.split("\n"):
            line = line.strip()
            if not line:
                continue
            clean = line.strip("`\"'").lstrip("-*â€¢").strip()
            if clean and clean not in suggestions:
                suggestions.append(clean)

    return SuggestionResponse(suggestions=suggestions[:3], status="completed")


async def analyze_code_with_llm(code: str, language: str) -> dict:
    """Uses Gemini to perform a detailed code review, focusing on bugs and code smells."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert code reviewer. Analyze the provided code for bugs, efficiency, "
                "readability, and code smells (anti-patterns, dead code, redundant logic). "
                "Return a JSON object with 'score' (0-100), 'feedback' (summary string), "
                "and 'detailed_reviews' (list of objects with 'line', 'comment', 'severity')."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def fix_code_with_llm(code: str, language: str) -> dict:
    """Provides an automated fix for bugs and smells in the code."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a skilled developer. Automatically fix the bugs and improve the quality "
                "of the provided code. Return a JSON object with 'fixed_code' and 'explanation' "
                "of the changes made. Keep the logic consistent with user intent."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def check_plagiarism_with_llm(code: str, language: str) -> dict:
    """Heuristically checks if the code snippet appears to be copied from common repositories."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a plagiarism detection assistant. Analyze the code and determine if it "
                "matches well-known algorithms or public snippets (e.g., from GitHub, StackOverflow). "
                "Return a JSON object with 'is_plagiarized' (boolean), 'confidence' (percentage), "
                "and 'likely_source' (description or URL if identifiable)."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def generate_code_from_nl(prompt: str, language: str) -> dict:
    """Generates code snippet from a natural language description."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert programmer. Convert the natural language prompt into high-quality code. "
                "Return a JSON object with 'code' and 'explanation'. "
                "Do NOT include markdown markers in the 'code' string."
            ),
        },
        {"role": "user", "content": f"Target Language: {language}\nPrompt: {prompt}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def analyze_complexity_with_llm(code: str, language: str) -> dict:
    """Uses Gemini to predict time and space complexity."""
    messages = [
        {
            "role": "system",
            "content": (
                "Predict the time and space complexity of the code. Return JSON with "
                "'time_complexity', 'space_complexity', and 'explanation'."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def predict_edge_cases_with_llm(code: str, language: str) -> dict:
    """Uses Gemini to predict potential edge cases."""
    messages = [
        {
            "role": "system",
            "content": (
                "Analyze the code and list potential edge cases or inputs that might break it. Return "
                "JSON with a list of 'cases' (each with 'input' and 'reason')."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}"},
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    return json.loads(response_text)


async def generate_question(request: "app.schemas.ai.AIGeneratedQuestionRequest") -> AIGeneratedQuestionResponse:
    """Generates a dynamic programming question based on topic and difficulty."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a senior coding interviewer. Generate a programming question. Return JSON with "
                "'title', 'description' (markdown), 'template_code', 'difficulty', and 'topic'. "
                "Be creative."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Topic: {request.topic}, Difficulty: {request.difficulty}, Language: {request.language}"
            ),
        },
    ]
    response_text = await _get_adhoc_google_response(messages, json_mode=True)
    data = json.loads(response_text)
    return AIGeneratedQuestionResponse(**data)
