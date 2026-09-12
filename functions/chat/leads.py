"""Lead capture helpers — structured extraction without fabricating fields."""

from __future__ import annotations

import re
from dataclasses import asdict, dataclass, fields
from typing import Any


@dataclass
class Lead:
    name: str = ""
    company: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    service: str = ""
    requirements: str = ""
    preferredContactMethod: str = ""

    def to_dict(self) -> dict[str, str]:
        return {k: v for k, v in asdict(self).items() if v}

    def has_contact(self) -> bool:
        return bool(self.email or self.phone)

    def is_meaningful(self) -> bool:
        return bool(self.service or self.requirements or self.location or self.has_contact())


EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"(?:\+?27|0)\s?\d[\d\s-]{7,14}\d")

SERVICE_HINTS = (
    ("physical guarding", "Physical Guarding"),
    ("guard", "Physical Guarding"),
    ("warehouse", "Physical Guarding"),
    ("factory", "Physical Guarding"),
    ("construction", "Physical Guarding"),
    ("armed response", "Armed Response"),
    ("vip", "VIP Protection"),
    ("close protection", "VIP Protection"),
    ("patrol", "Mobile Patrols"),
    ("investigation", "Private Investigation"),
    ("event", "Special Events"),
    ("escort", "Escorting"),
    ("loss prevention", "Loss Prevention"),
    ("training", "Security Training"),
    ("course", "Security Training"),
    ("grade", "Security Training"),
    ("firearm", "Firearm Training"),
)


def merge_leads(existing: Lead | None, incoming: Lead) -> Lead:
    base = existing or Lead()
    merged = Lead()
    for f in fields(Lead):
        current = getattr(base, f.name) or ""
        new = getattr(incoming, f.name) or ""
        setattr(merged, f.name, new or current)
    return merged


def extract_lead_signals(text: str, previous: Lead | None = None) -> Lead:
    """Best-effort extraction from user text — never invents missing values."""
    lead = Lead() if previous is None else Lead(**asdict(previous))
    lower = text.lower()

    email = EMAIL_RE.search(text)
    if email:
        lead.email = email.group(0)

    phone = PHONE_RE.search(text)
    if phone:
        lead.phone = re.sub(r"\s+", " ", phone.group(0)).strip()

    for hint, service in SERVICE_HINTS:
        if hint in lower:
            lead.service = service
            break

    # Simple location cue after "in/at/near"
    loc = re.search(
        r"\b(?:in|at|near|based in)\s+([A-Za-z][A-Za-z\s-]{2,40})",
        text,
        flags=re.IGNORECASE,
    )
    if loc:
        candidate = loc.group(1).strip(" .,!")
        if candidate.lower() not in {"south africa", "sa", "the", "a", "an"}:
            lead.location = candidate

    if any(word in lower for word in ("need", "require", "looking for", "want")):
        if not lead.requirements:
            lead.requirements = text.strip()[:500]

    if "whatsapp" in lower:
        lead.preferredContactMethod = "WhatsApp"
    elif "email" in lower and "call" not in lower:
        lead.preferredContactMethod = "Email"
    elif "call" in lower or "phone" in lower:
        lead.preferredContactMethod = "Phone"

    return lead


def lead_from_dict(data: Any) -> Lead:
    if not isinstance(data, dict):
        return Lead()
    kwargs = {}
    for f in fields(Lead):
        value = data.get(f.name)
        if isinstance(value, str):
            kwargs[f.name] = value.strip()[:300]
    return Lead(**kwargs)
