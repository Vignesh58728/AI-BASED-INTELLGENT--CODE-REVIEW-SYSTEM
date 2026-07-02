import ast
import json
from typing import Any, Dict, List, Optional, Tuple

import httpx
from openai import AsyncOpenAI
from groq import AsyncGroq

from app.core.config import settings
from app.schemas.ai import (
    AIGeneratedQuestionResponse,
    AIChatRequest,
    AIChatResponse,
    AIChatSource,
)
from app.schemas.ai_review import ExplainRequest, ExplainResponse, SuggestionResponse


DEFAULT_MODEL = "gpt-4o"

MODEL_PROVIDER_MAP: Dict[str, Tuple[str, str]] = {
    "default": ("groq", "llama-3.3-70b-versatile"),
    "llama 3.3 70b": ("groq", "llama-3.3-70b-versatile"),
    "llama 3.1 70b": ("groq", "llama-3.1-70b-versatile"),
    "llama 3.1 8b": ("groq", "llama-3.1-8b-instant"),
    "gpt-4o": ("openai", "gpt-4o"),
    "gpt-4o-mini": ("openai", "gpt-4o-mini"),
    "gpt-4-turbo": ("openai", "gpt-4-turbo"),
    "gpt-3.5-turbo": ("openai", "gpt-3.5-turbo"),
    "gemma 3": ("openrouter", "google/gemma-3-27b:free"),
    "gpt-oss": ("openrouter", "meta-llama/llama-3.1-8b-instruct:free"), # Fallback for custom provider
    "openai/gpt-oss-120b": ("openrouter", "meta-llama/llama-3.1-8b-instruct:free"),
    "gemini 2.5 flash": ("google", "gemini-1.5-flash"),
}

PROVIDER_SYSTEM_PROMPTS: Dict[str, str] = {
    "groq": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "openai": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "anthropic": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "deepseek": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "openrouter": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "gpt_oss": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
    "google": (
        "You are an expert AIVISO Professional Code Reviewer. You must answer any questions the user has, from A to Z, on any topic, not just coding. "
        "If the user asks a coding question, provide clear step-by-step reasoning and tradeoffs. "
        "For non-coding questions, be as helpful, knowledgeable, and detailed as possible."
    ),
}

FALLBACK_ORDER: List[Tuple[str, str]] = [
    ("groq", "llama-3.1-8b-instant"),
    ("openrouter", "meta-llama/llama-3.1-8b-instruct:free"),
    ("google", "gemini-1.5-flash"),
    ("openai", "gpt-4o-mini"),
]


def _provider_key(provider: str) -> Optional[str]:
    key_map = {
        "groq": settings.GROQ_API_KEY,
        "openai": settings.OPENAI_API_KEY,
        "anthropic": settings.ANTHROPIC_API_KEY,
        "deepseek": settings.DEEPSEEK_API_KEY,
        "perplexity": settings.PERPLEXITY_API_KEY,
        "openrouter": settings.OPENROUTER_API_KEY,
        "gpt_oss": settings.GPT_OSS_API_KEY,
        "google": settings.GEMINI_API_KEY,
    }
    return key_map.get(provider)


def _resolve_provider(model_name: Optional[str], use_web_search: bool) -> Tuple[str, str]:
    normalized = (model_name or "default").strip().lower()
    
    # Priority 1: Explicitly requested model if valid key exists
    if normalized in MODEL_PROVIDER_MAP:
        provider, model = MODEL_PROVIDER_MAP[normalized]
        if _provider_key(provider):
            return provider, model

    # Priority 2: Go through Fallback Order to find ANY working key
    for fallback_provider, fallback_model in FALLBACK_ORDER:
        if _provider_key(fallback_provider):
            return fallback_provider, fallback_model

    # Priority 3: Check "default" entry if nothing else worked
    provider, model = MODEL_PROVIDER_MAP.get("default", ("none", "none"))
    if _provider_key(provider):
        return provider, model

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


async def _chat_gemini(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    """Native Gemini REST API implementation (generateContent)."""
    # Convert OpenAI-style messages to Gemini-style contents
    contents = []
    system_instruction = ""
    for msg in messages:
        if msg["role"] == "system":
            system_instruction = msg["content"]
        else:
            role = "user" if msg["role"] == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg["content"]}]})

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {"contents": contents}
    if system_instruction:
        payload["system_instruction"] = {"parts": [{"text": system_instruction}]}

    async with httpx.AsyncClient(timeout=45) as http:
        response = await http.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

    # Extract answer
    try:
        answer = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        answer = "Gemini returned an empty or malformed response."

    return answer, [AIChatSource(title="AI Generated", url="#")]

async def _chat_google_genai(messages: List[Dict[str, str]], model: str, api_key: str) -> Tuple[str, List[AIChatSource]]:
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        # Fallback to Gemini REST API if google-genai is not installed
        return await _chat_gemini(messages, model, api_key)
    
    try:
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
    except Exception as e:
        print(f"Google GenAI error: {e}, falling back to REST API")
        return await _chat_gemini(messages, model, api_key)


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






async def _execute_chat_provider(provider: str, model: str, messages: List[Dict[str, str]], request: AIChatRequest) -> Tuple[str, List[AIChatSource]]:
    if provider == "groq":
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is missing.")
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        completion = await client.chat.completions.create(messages=messages, model=model)
        answer = completion.choices[0].message.content
        return answer, [AIChatSource(title="AI Generated", url="#")]
    elif provider == "openai":
        return await _chat_openai_compatible(
            base_url="https://api.openai.com/v1",
            api_key=settings.OPENAI_API_KEY or "",
            model=model,
            messages=messages,
        )
    elif provider == "deepseek":
        return await _chat_openai_compatible(
            base_url="https://api.deepseek.com",
            api_key=settings.DEEPSEEK_API_KEY or "",
            model=model,
            messages=messages,
        )
    elif provider == "anthropic":
        return await _chat_anthropic(messages, model, settings.ANTHROPIC_API_KEY or "")
    elif provider == "perplexity":
        return await _chat_perplexity(messages, model, settings.PERPLEXITY_API_KEY or "")
    elif provider == "openrouter":
        return await _chat_openai_compatible(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY or "",
            model=model,
            messages=messages,
        )
    elif provider == "gpt_oss":
        return await _chat_openai_compatible(
            base_url="https://api.openai.com/v1", # Default to OpenAI compatible base
            api_key=settings.GPT_OSS_API_KEY or "",
            model=model,
            messages=messages,
        )
    elif provider == "google":
        return await _chat_google_genai(messages, model, settings.GEMINI_API_KEY or "")
    else:
        # Default fallback to Groq
        if settings.GROQ_API_KEY:
            client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            completion = await client.chat.completions.create(messages=messages, model="llama-3.3-70b-versatile")
            answer = completion.choices[0].message.content
            return answer, [AIChatSource(title="AI Generated", url="#")]
        else:
            return await _chat_openai_compatible(
                base_url="https://api.openai.com/v1",
                api_key=settings.OPENAI_API_KEY or "",
                model="llama-3.3-70b-versatile" if settings.GROQ_API_KEY else DEFAULT_MODEL,
                messages=messages,
            )


async def get_chat_response(request: AIChatRequest) -> AIChatResponse:
    try:
        provider, model = _resolve_provider(request.model, request.use_web_search)
        if provider == "none":
            return AIChatResponse(
                answer="⚠️ **AI Engine Offline**: No valid API keys found in the server's `.env` configuration. Please add your GROQ_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY to start the intelligence core.",
                sources=[AIChatSource(title="Configuration Required", url="#")],
                suggested_questions=["How do I add API keys?", "Where is the .env file?"],
                status="failed",
            )

        # Build a list of all possibly working configs to try in sequence
        configs_to_try = [(provider, model)]
        for f_provider, f_model in FALLBACK_ORDER:
            if (f_provider, f_model) not in configs_to_try and _provider_key(f_provider):
                configs_to_try.append((f_provider, f_model))

        errors = []
        for current_provider, current_model in configs_to_try:
            try:
                messages = _build_messages(request, current_provider)
                answer, sources = await _execute_chat_provider(current_provider, current_model, messages, request)
                
                return AIChatResponse(
                    answer=answer,
                    sources=sources,
                    suggested_questions=_suggested_questions(current_provider),
                    status="completed",
                )
            except Exception as exc:
                err_detail = f"{current_provider}({current_model}): {str(exc)}"
                print(f"DEBUG: Provider Fallback - {err_detail}")
                errors.append(err_detail)
                continue

        # If we reach here, everything failed
        error_history = "\n".join([f"- {e}" for e in errors])
        return AIChatResponse(
            answer=(
                "❌ **AI Connection Failure**: All configured AI providers are currently unreachable.\n\n"
                "**Potential Causes:**\n"
                "1. API rate limits exceeded\n"
                "2. Invalid or expired API handles\n"
                "3. Network restrictions on the server\n\n"
                f"**Technical Details:**\n{error_history}"
            ),
            sources=[AIChatSource(title="System Error", url="#")],
            suggested_questions=["Check API Billing Status", "Verify Server Internet", "Try a different model"],
            status="failed",
        )
    except Exception as fatal_e:
        print(f"CRITICAL: Fatal error in get_chat_response: {fatal_e}")
        return AIChatResponse(
            answer="🚨 **System Crash**: The AI engine encountered a critical internal error. Please restart the backend server.",
            sources=[],
            suggested_questions=[],
            status="failed"
        )


async def explain_code(request: ExplainRequest) -> ExplainResponse:
    """Provides a detailed line-by-line explanation of code logic."""
    # Use the requested model if provided, else default
    model_to_use = request.model or "default"
    
    # Reuse AIChatRequest logic to leverage the existing provider resolution
    line_context = f"Specifically focus on line {request.line}. " if request.line else ""
    
    chat_request = AIChatRequest(
        query=(
            f"{line_context}Explain this {request.language} code logic step-by-step and line-by-line. "
            "Help me understand the algorithm and flow. "
            "IMPORTANT: Do NOT give me the corrected code or the full solution. "
            "Just explain the logic. Use markdown formatting with code highlights."
        ),
        model=model_to_use,
        file_context=f"Language: {request.language}\nCode to Explain:\n{request.code}",
        history=[],
        language_hint=request.language_hint or "english"
    )
    
    try:
        chat_response = await get_chat_response(chat_request)
        if chat_response.status == "failed":
            return ExplainResponse(explanation=chat_response.answer, status="failed")
            
        return ExplainResponse(explanation=chat_response.answer, status="completed")
    except Exception as e:
        return ExplainResponse(explanation=f"Explanation failed: {str(e)}", status="failed")



async def _get_completion_text(messages: list, temperature: float = 0.3, model_name: str = "default") -> str:
    """Helper for internal completions using the standard chat provider logic."""
    from app.schemas.ai import AIChatRequest
    
    # Extract the last user message and history
    query = ""
    history = []
    for msg in messages:
        if msg["role"] == "user":
            query = msg["content"]
        elif msg["role"] == "assistant":
            history.append(msg)
            
    request = AIChatRequest(
        query=query,
        model=model_name,
        history=history,
        language_hint="english"
    )
    
    response = await get_chat_response(request)
    if response.status == "failed":
        raise ValueError(f"AI Completion failed: {response.answer}")
    return response.answer.strip()

async def get_suggestions(request: ExplainRequest) -> SuggestionResponse:
    """Provides real AI code completions using the configured model."""
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

    try:
        raw_content = await _get_completion_text(messages, temperature=0.3, model_name=request.model or "default")
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
                clean = line.strip("`\"'").lstrip("-*•").strip()
                if clean and clean not in suggestions:
                    suggestions.append(clean)

        return SuggestionResponse(suggestions=suggestions[:3], status="completed")
    except Exception as e:
        print(f"Suggestions error: {e}")
        return SuggestionResponse(suggestions=[], status="failed")


async def analyze_code_with_llm(code: str, language: str, model: str = "default") -> dict:
    """Uses LLM to perform a detailed code review, focusing on bugs and code smells."""
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
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.3, model_name=model)
        # Extract JSON from markdown code blocks if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Code analysis error: {e}")
        return {"score": 0, "feedback": f"Analysis failed: {str(e)}", "detailed_reviews": []}


async def fix_code_with_llm(code: str, language: str, model: str = "default") -> dict:
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
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.3, model_name=model)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Code fix error: {e}")
        return {"fixed_code": code, "explanation": f"Fix failed: {str(e)}"}


async def check_plagiarism_with_llm(code: str, language: str, model: str = "default") -> dict:
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
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.3, model_name=model)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Plagiarism check error: {e}")
        return {"is_plagiarized": False, "confidence": 0, "likely_source": f"Check failed: {str(e)}"}


async def generate_code_from_nl(prompt: str, language: str, model: str = "default") -> dict:
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
        {"role": "user", "content": f"Target Language: {language}\nPrompt: {prompt}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.5, model_name=model)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Code generation error: {e}")
        return {"code": "", "explanation": f"Generation failed: {str(e)}"}


async def analyze_complexity_with_llm(code: str, language: str, model: str = "default") -> dict:
    """Uses LLM to predict time and space complexity."""
    messages = [
        {
            "role": "system",
            "content": (
                "Predict the time and space complexity of the code. Return JSON with "
                "'time_complexity', 'space_complexity', and 'explanation'."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.3, model_name=model)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Complexity analysis error: {e}")
        return {"time_complexity": "Unknown", "space_complexity": "Unknown", "explanation": f"Analysis failed: {str(e)}"}


async def predict_edge_cases_with_llm(code: str, language: str, model: str = "default") -> dict:
    """Uses LLM to predict potential edge cases."""
    messages = [
        {
            "role": "system",
            "content": (
                "Analyze the code and list potential edge cases or inputs that might break it. Return "
                "JSON with a list of 'cases' (each with 'input' and 'reason')."
            ),
        },
        {"role": "user", "content": f"Language: {language}\nCode:\n{code}\n\nReturn valid JSON only."},
    ]
    
    try:
        response_text = await _get_completion_text(messages, temperature=0.3, model_name=model)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        return json.loads(response_text)
    except Exception as e:
        print(f"Edge case prediction error: {e}")
        return {"cases": []}


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
                f"Topic: {request.topic}, Difficulty: {request.difficulty}, Language: {request.language}\n\nReturn valid JSON only."
            ),
        },
    ]

    if not settings.GROQ_API_KEY and not settings.OPENAI_API_KEY:
        return AIGeneratedQuestionResponse(
            title="API Not Configured",
            description="Please configure GROQ_API_KEY in backend .env",
            template_code="# API key required",
            difficulty=request.difficulty,
            topic=request.topic
        )

    try:
        response_text = await _get_completion_text(messages, temperature=0.7)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        data = json.loads(response_text)
        return AIGeneratedQuestionResponse(**data)
    except Exception as e:
        print(f"Question generation error: {e}")
        return AIGeneratedQuestionResponse(
            title="Generation Failed",
            description=f"Error: {str(e)}",
            template_code="# Error occurred",
            difficulty=request.difficulty,
            topic=request.topic
        )


