export type Lead = {
	name?: string;
	company?: string;
	email?: string;
	phone?: string;
	location?: string;
	service?: string;
	requirements?: string;
	preferredContactMethod?: string;
};

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const PHONE_RE = /(?:\+?27|0)\s?\d[\d\s-]{7,14}\d/;

const SERVICE_HINTS: Array<[string, string]> = [
	['physical guarding', 'Physical Guarding'],
	['security guard', 'Physical Guarding'],
	['onogada', 'Physical Guarding'],
	['nogada', 'Physical Guarding'],
	['guard', 'Physical Guarding'],
	['warehouse', 'Physical Guarding'],
	['factory', 'Physical Guarding'],
	['construction', 'Physical Guarding'],
	['armed response', 'Armed Response'],
	['vip', 'VIP Protection'],
	['close protection', 'VIP Protection'],
	['patrol', 'Mobile Patrols'],
	['investigation', 'Private Investigation'],
	['abaphenyi', 'Private Investigation'],
	['event', 'Special Events'],
	['emcimbini', 'Special Events'],
	['escort', 'Escorting'],
	['loss prevention', 'Loss Prevention'],
	['training', 'Security Training'],
	['ukuqeqeshwa', 'Security Training'],
	['course', 'Security Training'],
	['grade', 'Security Training'],
	['firearm', 'Firearm Training'],
	['izibhamu', 'Firearm Training'],
	['gun', 'Firearm Training']
];

const FIELDS: (keyof Lead)[] = [
	'name',
	'company',
	'email',
	'phone',
	'location',
	'service',
	'requirements',
	'preferredContactMethod'
];

export function leadToDict(lead: Lead): Record<string, string> | null {
	const out: Record<string, string> = {};
	for (const key of FIELDS) {
		const value = lead[key];
		if (value) out[key] = value;
	}
	return Object.keys(out).length ? out : null;
}

export function leadFromDict(data: unknown): Lead {
	if (!data || typeof data !== 'object') return {};
	const src = data as Record<string, unknown>;
	const lead: Lead = {};
	for (const key of FIELDS) {
		const value = src[key];
		if (typeof value === 'string') lead[key] = value.trim().slice(0, 300);
	}
	return lead;
}

export function mergeLeads(existing: Lead, incoming: Lead): Lead {
	const merged: Lead = {};
	for (const key of FIELDS) {
		merged[key] = incoming[key] || existing[key] || undefined;
	}
	return merged;
}

export function extractLeadSignals(text: string): Lead {
	const lead: Lead = {};
	const lower = text.toLowerCase();

	const email = text.match(EMAIL_RE);
	if (email) lead.email = email[0];

	const phone = text.match(PHONE_RE);
	if (phone) lead.phone = phone[0].replace(/\s+/g, ' ').trim();

	for (const [hint, service] of SERVICE_HINTS) {
		if (lower.includes(hint)) {
			lead.service = service;
			break;
		}
	}

	const loc = text.match(/\b(?:in|at|near|based in)\s+([A-Za-z][A-Za-z\s-]{2,40})/i);
	if (loc) {
		const candidate = loc[1].trim().replace(/[.,!]+$/, '');
		if (!['south africa', 'sa', 'the', 'a', 'an'].includes(candidate.toLowerCase())) {
			lead.location = candidate;
		}
	}

	if (['need', 'require', 'looking for', 'want', 'ngidinga', 'ngifuna'].some((w) => lower.includes(w))) {
		lead.requirements = text.trim().slice(0, 500);
	}

	if (lower.includes('whatsapp') || lower.includes('iwhatsapp')) lead.preferredContactMethod = 'WhatsApp';
	else if (lower.includes('email') && !lower.includes('call')) lead.preferredContactMethod = 'Email';
	else if (
		lower.includes('call') ||
		lower.includes('phone') ||
		lower.includes('angishayele') ||
		lower.includes('shayela')
	) {
		lead.preferredContactMethod = 'Phone';
	}
	return lead;
}
