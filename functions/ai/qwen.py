"""Qwen (DashScope OpenAI-compatible) AI provider.

Uses the official OpenAI-compatible chat completions HTTP API.
Endpoint and model are configurable via environment variables — no invented URLs.
Default base URL is DashScope international OpenAI-compatible endpoint.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

from ai.base import AIResponse, AIService, ChatMessage


class AIServiceError(Exception):
    """Raised when the upstream AI provider fails."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


class QwenAIService(AIService):
    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        base_url: str | None = None,
        timeout_seconds: float | None = None,
    ) -> None:
        self.api_key = api_key or os.environ.get("QWEN_API_KEY") or os.environ.get("DASHSCOPE_API_KEY")
        self.model = model or os.environ.get("QWEN_MODEL", "qwen-plus")
        # Official DashScope international OpenAI-compatible base URL.
        # Override with QWEN_API_BASE_URL if using a workspace-specific domain.
        self.base_url = (
            base_url
            or os.environ.get("QWEN_API_BASE_URL")
            or "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
        ).rstrip("/")
        self.timeout_seconds = timeout_seconds or float(os.environ.get("QWEN_TIMEOUT_SECONDS", "45"))

    def chat(
        self,
        messages: list[ChatMessage],
        *,
        max_tokens: int = 512,
        temperature: float = 0.4,
    ) -> AIResponse:
        if not self.api_key:
            raise AIServiceError(
                "Thanks for your message — our AI assistant is temporarily unavailable. "
                "Please contact ProSiya on +27 78 523 6606 or "
                "email dladla.siya@gmail.com and the team will gladly help.",
                status_code=503,
            )

        url = f"{self.base_url}/chat/completions"
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": [{"role": m.role, "content": m.content} for m in messages],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        body = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=body,
            method="POST",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(request, timeout=self.timeout_seconds) as response:
                raw = response.read().decode("utf-8")
                data = json.loads(raw)
        except urllib.error.HTTPError as exc:
            detail = ""
            try:
                detail = exc.read().decode("utf-8")[:200]
            except Exception:
                pass
            raise AIServiceError(
                "The assistant service returned an error.",
                status_code=exc.code,
            ) from None
        except urllib.error.URLError as exc:
            raise AIServiceError("The assistant service is temporarily unavailable.") from None
        except TimeoutError as exc:
            raise AIServiceError("The assistant service timed out. Please try again.") from None
        except json.JSONDecodeError as exc:
            raise AIServiceError("Received an invalid response from the assistant service.") from None

        return self._parse_response(data)

    def _parse_response(self, data: dict[str, Any]) -> AIResponse:
        choices = data.get("choices")
        if not isinstance(choices, list) or not choices:
            raise AIServiceError("Received an empty response from the assistant service.")

        message = choices[0].get("message") or {}
        content = message.get("content")
        if not isinstance(content, str) or not content.strip():
            raise AIServiceError("Received an invalid response from the assistant service.")

        usage = data.get("usage") if isinstance(data.get("usage"), dict) else None
        return AIResponse(
            content=content.strip(),
            model=str(data.get("model") or self.model),
            finish_reason=choices[0].get("finish_reason"),
            usage=usage,
        )
