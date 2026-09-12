"""Knowledge retrieval abstraction for ProSiya chatbot.

Initial version: load a single verified markdown knowledge file and optionally
select relevant sections by simple keyword scoring. Designed so embeddings /
vector retrieval can replace `_score_sections` later without changing callers.
"""

from __future__ import annotations

import re
from pathlib import Path

KNOWLEDGE_PATH = Path(__file__).resolve().parent.parent / "knowledge" / "prosiya.md"

# Lightweight topic hints for section selection (not hard-coded FAQ answers).
TOPIC_KEYWORDS: dict[str, tuple[str, ...]] = {
    "contact": ("contact", "phone", "email", "whatsapp", "address", "durban", "call", "reach"),
    "services": (
        "guard",
        "security",
        "warehouse",
        "factory",
        "construction",
        "commercial",
        "patrol",
        "vip",
        "armed",
        "escort",
        "investigation",
        "event",
        "loss prevention",
        "protect",
    ),
    "training": (
        "course",
        "training",
        "grade",
        "psira",
        "firearm",
        "handgun",
        "rifle",
        "shotgun",
        "cpo",
        "cit",
        "price",
        "cost",
        "fee",
        "enroll",
        "enrol",
        "study",
    ),
    "payment": ("pay", "payment", "paypal", "proof", "eft", "deposit"),
    "company": ("about", "company", "prosiya", "mission", "vision", "owner", "director", "dladla"),
    "accreditation": ("accreditation", "qcto", "sasseta", "psira", "saps"),
}


class KnowledgeService:
    """Loads and retrieves ProSiya knowledge for LLM context."""

    def __init__(self, knowledge_path: Path | None = None) -> None:
        self._path = knowledge_path or KNOWLEDGE_PATH
        self._full_text: str | None = None

    def load_full(self) -> str:
        if self._full_text is None:
            if not self._path.exists():
                raise FileNotFoundError(f"Knowledge file missing: {self._path}")
            self._full_text = self._path.read_text(encoding="utf-8")
        return self._full_text

    def get_relevant_context(self, query: str, max_chars: int = 6000) -> str:
        """Return relevant knowledge for a query.

        For a small knowledge base, prefer the full document when it fits.
        Otherwise return top-scoring markdown sections.
        """
        full = self.load_full()
        if len(full) <= max_chars:
            return full

        sections = self._split_sections(full)
        if not sections:
            return full[:max_chars]

        scored = sorted(
            ((self._score_sections(query, title, body), title, body) for title, body in sections),
            key=lambda item: item[0],
            reverse=True,
        )

        selected: list[str] = []
        total = 0
        for score, title, body in scored:
            if score <= 0 and selected:
                continue
            chunk = f"## {title}\n{body}".strip()
            if total + len(chunk) > max_chars and selected:
                break
            selected.append(chunk)
            total += len(chunk)
            if total >= max_chars * 0.8:
                break

        return "\n\n".join(selected) if selected else full[:max_chars]

    @staticmethod
    def _split_sections(text: str) -> list[tuple[str, str]]:
        parts = re.split(r"\n## ", text)
        sections: list[tuple[str, str]] = []
        for i, part in enumerate(parts):
            part = part.strip()
            if not part:
                continue
            if i == 0 and part.startswith("# "):
                lines = part.split("\n", 1)
                title = lines[0].lstrip("# ").strip()
                body = lines[1] if len(lines) > 1 else ""
            else:
                lines = part.split("\n", 1)
                title = lines[0].strip()
                body = lines[1] if len(lines) > 1 else ""
            sections.append((title, body.strip()))
        return sections

    @staticmethod
    def _score_sections(query: str, title: str, body: str) -> float:
        q = query.lower()
        haystack = f"{title}\n{body}".lower()
        score = 0.0
        for tokens in TOPIC_KEYWORDS.values():
            for token in tokens:
                if token in q and token in haystack:
                    score += 2.0
                elif token in q:
                    score += 0.2
        for word in re.findall(r"[a-z0-9+]{3,}", q):
            if word in haystack:
                score += 0.5
        if "company" in title.lower() or "contact" in title.lower():
            score += 0.1
        return score
