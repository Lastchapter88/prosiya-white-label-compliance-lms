"""Conversation orchestration: validation, knowledge, AI, leads."""

from __future__ import annotations

import re
import uuid
from dataclasses import dataclass
from typing import Any

from ai.base import AIService, ChatMessage
from ai.qwen import AIServiceError
from chat.knowledge import KnowledgeService
from chat.leads import Lead, extract_lead_signals, lead_from_dict, merge_leads
from chat.prompts import build_system_message

MAX_MESSAGE_LENGTH = 1500
MAX_HISTORY_MESSAGES = 12
MAX_HISTORY_CHARS = 6000
FRIENDLY_ERROR = (
    "Sorry, I'm having trouble connecting right now. Please try again or contact "
    "ProSiya on +27 78 523 6606 or email dladla.siya@gmail.com."
)


@dataclass
class ChatResult:
    conversation_id: str
    message: str
    lead: dict[str, str] | None = None
    handoff_suggested: bool = False


class ValidationError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


class ConversationService:
    def __init__(
        self,
        ai_service: AIService,
        knowledge_service: KnowledgeService | None = None,
    ) -> None:
        self.ai = ai_service
        self.knowledge = knowledge_service or KnowledgeService()

    def handle(self, payload: dict[str, Any]) -> ChatResult:
        message = self._validate_message(payload.get("message"))
        conversation_id = self._validate_conversation_id(payload.get("conversationId"))
        history = self._validate_history(payload.get("history"))
        lead = merge_leads(
            lead_from_dict(payload.get("lead")),
            extract_lead_signals(message),
        )

        knowledge = self.knowledge.get_relevant_context(message)
        system = build_system_message(knowledge)

        messages: list[ChatMessage] = [ChatMessage(role="system", content=system)]
        for item in history:
            messages.append(ChatMessage(role=item["role"], content=item["content"]))
        messages.append(ChatMessage(role="user", content=message))

        try:
            response = self.ai.chat(messages, max_tokens=512, temperature=0.35)
        except AIServiceError:
            raise
        except Exception as exc:
            raise AIServiceError(FRIENDLY_ERROR) from exc

        assistant_text = self._sanitize_assistant_output(response.content)
        handoff = self._suggests_handoff(message, assistant_text)

        return ChatResult(
            conversation_id=conversation_id,
            message=assistant_text,
            lead=lead.to_dict() or None,
            handoff_suggested=handoff,
        )

    @staticmethod
    def _validate_message(message: Any) -> str:
        if not isinstance(message, str) or not message.strip():
            raise ValidationError("Please enter a message.")
        cleaned = message.strip()
        if len(cleaned) > MAX_MESSAGE_LENGTH:
            raise ValidationError(
                f"Messages must be {MAX_MESSAGE_LENGTH} characters or fewer."
            )
        return cleaned

    @staticmethod
    def _validate_conversation_id(conversation_id: Any) -> str:
        if conversation_id is None or conversation_id == "":
            return str(uuid.uuid4())
        if not isinstance(conversation_id, str):
            raise ValidationError("Invalid conversationId.")
        if len(conversation_id) > 80 or not re.fullmatch(r"[A-Za-z0-9_-]+", conversation_id):
            raise ValidationError("Invalid conversationId.")
        return conversation_id

    @staticmethod
    def _validate_history(history: Any) -> list[dict[str, str]]:
        if history is None:
            return []
        if not isinstance(history, list):
            raise ValidationError("Invalid history.")
        cleaned: list[dict[str, str]] = []
        total_chars = 0
        for item in history[-MAX_HISTORY_MESSAGES:]:
            if not isinstance(item, dict):
                continue
            role = item.get("role")
            content = item.get("content")
            if role not in ("user", "assistant") or not isinstance(content, str):
                continue
            text = content.strip()
            if not text:
                continue
            text = text[:MAX_MESSAGE_LENGTH]
            total_chars += len(text)
            if total_chars > MAX_HISTORY_CHARS:
                break
            cleaned.append({"role": role, "content": text})
        return cleaned

    @staticmethod
    def _sanitize_assistant_output(text: str) -> str:
        # Strip accidental provider leakage if the model ever mentions it.
        banned = (
            r"\b(qwen|dashscope|alibaba|openai|chatgpt|claude|anthropic)\b"
        )
        cleaned = re.sub(banned, "our assistant platform", text, flags=re.IGNORECASE)
        return cleaned.strip()

    @staticmethod
    def _suggests_handoff(user_message: str, assistant_message: str) -> bool:
        cues = (
            "speak to a human",
            "talk to someone",
            "real person",
            "call me",
            "quotation",
            "quote",
            "contact prosiya",
            "don't have enough information",
        )
        blob = f"{user_message}\n{assistant_message}".lower()
        return any(c in blob for c in cues)
