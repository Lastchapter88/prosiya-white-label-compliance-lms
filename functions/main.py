"""Firebase Cloud Functions for ProSiya LMS + AI assistant."""

from __future__ import annotations

import json
from typing import Any

from firebase_admin import firestore, initialize_app
from firebase_functions import firestore_fn, https_fn, options
from firebase_functions.params import StringParam

from ai.qwen import AIServiceError, QwenAIService
from chat.rate_limit import RateLimiter
from chat.service import FRIENDLY_ERROR, ConversationService, ValidationError

# Deploy-time params from functions/.env (never commit real keys).
QWEN_API_KEY = StringParam("QWEN_API_KEY")
QWEN_MODEL = StringParam("QWEN_MODEL", default="qwen-plus")
QWEN_API_BASE_URL = StringParam(
    "QWEN_API_BASE_URL",
    default="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
)

initialize_app()
db = firestore.client()

# Cost control: 20 requests / minute / client key (IP or conversation).
_rate_limiter = RateLimiter(max_requests=20, window_seconds=60)

ALLOWED_ORIGINS = {
    "https://prosiya-e751a.web.app",
    "https://prosiya-e751a.firebaseapp.com",
    "https://www.prosiyagroup.co.za",
    "https://prosiyagroup.co.za",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
}


def _cors_headers(origin: str | None) -> dict[str, str]:
    allowed = origin if origin in ALLOWED_ORIGINS else "https://prosiya-e751a.web.app"
    return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
        "Content-Type": "application/json; charset=utf-8",
        "Vary": "Origin",
    }


def _json_response(payload: dict[str, Any], status: int, origin: str | None) -> https_fn.Response:
    return https_fn.Response(
        json.dumps(payload),
        status=status,
        headers=_cors_headers(origin),
    )


def _client_key(req: https_fn.Request, conversation_id: str | None) -> str:
    forwarded = req.headers.get("X-Forwarded-For", "")
    ip = forwarded.split(",")[0].strip() if forwarded else (req.remote_addr or "unknown")
    return f"{ip}:{conversation_id or 'new'}"


def _maybe_persist_lead(conversation_id: str, lead: dict[str, str] | None) -> None:
    """Persist meaningful leads only — no full chat transcripts."""
    if not lead:
        return
    if not (lead.get("email") or lead.get("phone") or lead.get("service")):
        return
    try:
        db.collection("chat_leads").document(conversation_id).set(
            {
                **lead,
                "conversationId": conversation_id,
                "updatedAt": firestore.SERVER_TIMESTAMP,
                "source": "website_chat",
            },
            merge=True,
        )
    except Exception:
        # Lead persistence must never break the visitor-facing chat response.
        pass


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=list(ALLOWED_ORIGINS),
        cors_methods=["POST", "OPTIONS"],
    ),
    memory=options.MemoryOption.MB_256,
    timeout_sec=60,
)
def chat(req: https_fn.Request) -> https_fn.Response:
    """POST /chat — ProSiya AI assistant endpoint (Qwen-backed, key server-side)."""
    origin = req.headers.get("Origin")

    if req.method == "OPTIONS":
        return https_fn.Response("", status=204, headers=_cors_headers(origin))

    if req.method != "POST":
        return _json_response({"error": "Method not allowed."}, 405, origin)

    try:
        payload = req.get_json(silent=True) or {}
    except Exception:
        return _json_response({"error": "Invalid JSON body."}, 400, origin)

    if not isinstance(payload, dict):
        return _json_response({"error": "Invalid request body."}, 400, origin)

    conversation_hint = payload.get("conversationId") if isinstance(payload.get("conversationId"), str) else None
    if not _rate_limiter.allow(_client_key(req, conversation_hint)):
        return _json_response(
            {"error": "Too many requests. Please wait a moment and try again."},
            429,
            origin,
        )

    try:
        service = ConversationService(
            ai_service=QwenAIService(
                api_key=QWEN_API_KEY.value,
                model=QWEN_MODEL.value,
                base_url=QWEN_API_BASE_URL.value,
            )
        )
        result = service.handle(payload)
        _maybe_persist_lead(result.conversation_id, result.lead)
        return _json_response(
            {
                "conversationId": result.conversation_id,
                "message": result.message,
                "lead": result.lead,
                "handoffSuggested": result.handoff_suggested,
            },
            200,
            origin,
        )
    except ValidationError as exc:
        return _json_response({"error": str(exc)}, exc.status_code, origin)
    except AIServiceError as exc:
        # Surface coming-soon / configuration messages without leaking internals.
        msg = str(exc) if "coming soon" in str(exc).lower() else FRIENDLY_ERROR
        return _json_response({"error": msg, "message": msg}, 503, origin)
    except Exception:
        return _json_response({"error": FRIENDLY_ERROR}, 500, origin)


@https_fn.on_request()
def add_user(req: https_fn.Request) -> https_fn.Response:
    """HTTP Cloud Function to add a user (Example)."""
    original = req.args.get("text")
    if original is None:
        return https_fn.Response("No text provided", status=400)

    write_result = db.collection("users").add({"original": original})
    return https_fn.Response(f"Users with ID: {write_result[1].id} added.")


@firestore_fn.on_document_created(document="users/{userId}")
def on_user_created(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]) -> None:
    """Trigger: When a user document is created, initialize their profile."""
    user_data = event.data.to_dict() or {}
    user_id = event.params["userId"]
    print(f"New user created: {user_id}")
    if "role" not in user_data:
        db.collection("users").document(user_id).update({"role": "student"})


@https_fn.on_request()
def enroll_student(req: https_fn.Request) -> https_fn.Response:
    """HTTP Function: Enrolls a student in a course (placeholder)."""
    return https_fn.Response("Enrollment logic placeholder")
