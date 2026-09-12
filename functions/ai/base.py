"""AI provider abstraction — application code depends on AIService only."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Literal

Role = Literal["system", "user", "assistant"]


@dataclass
class ChatMessage:
    role: Role
    content: str


@dataclass
class AIResponse:
    content: str
    model: str
    finish_reason: str | None = None
    usage: dict | None = None


class AIService(ABC):
    """Provider-agnostic chat completion interface."""

    @abstractmethod
    def chat(
        self,
        messages: list[ChatMessage],
        *,
        max_tokens: int = 512,
        temperature: float = 0.4,
    ) -> AIResponse:
        raise NotImplementedError
