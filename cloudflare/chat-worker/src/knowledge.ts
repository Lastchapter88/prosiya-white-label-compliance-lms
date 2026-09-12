import { KNOWLEDGE_MARKDOWN as knowledgeMarkdown } from './knowledgeContent';

const TOPIC_KEYWORDS: Record<string, string[]> = {
	contact: ['contact', 'phone', 'email', 'whatsapp', 'address', 'durban', 'call', 'reach'],
	services: [
		'guard',
		'security',
		'warehouse',
		'factory',
		'construction',
		'commercial',
		'patrol',
		'vip',
		'armed',
		'escort',
		'investigation',
		'event',
		'loss prevention',
		'protect'
	],
	training: [
		'course',
		'training',
		'grade',
		'psira',
		'firearm',
		'handgun',
		'rifle',
		'shotgun',
		'cpo',
		'cit',
		'price',
		'cost',
		'fee',
		'enroll',
		'enrol',
		'study'
	],
	payment: ['pay', 'payment', 'paypal', 'proof', 'eft', 'deposit'],
	company: ['about', 'company', 'prosiya', 'mission', 'vision', 'owner', 'director', 'dladla'],
	accreditation: ['accreditation', 'qcto', 'sasseta', 'psira', 'saps']
};

function splitSections(text: string): Array<[string, string]> {
	const parts = text.split(/\n## /);
	const sections: Array<[string, string]> = [];
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();
		if (!part) continue;
		const lines = part.split('\n');
		let title = lines[0].trim();
		if (i === 0 && title.startsWith('# ')) title = title.replace(/^#\s+/, '');
		const body = lines.slice(1).join('\n').trim();
		sections.push([title, body]);
	}
	return sections;
}

function scoreSection(query: string, title: string, body: string): number {
	const q = query.toLowerCase();
	const haystack = `${title}\n${body}`.toLowerCase();
	let score = 0;
	for (const tokens of Object.values(TOPIC_KEYWORDS)) {
		for (const token of tokens) {
			if (q.includes(token) && haystack.includes(token)) score += 2;
			else if (q.includes(token)) score += 0.2;
		}
	}
	for (const word of q.match(/[a-z0-9+]{3,}/g) || []) {
		if (haystack.includes(word)) score += 0.5;
	}
	const titleLower = title.toLowerCase();
	if (titleLower.includes('company') || titleLower.includes('contact')) score += 0.1;
	return score;
}

export function getRelevantContext(query: string, maxChars = 6000): string {
	const full = knowledgeMarkdown;
	if (full.length <= maxChars) return full;

	const sections = splitSections(full);
	if (!sections.length) return full.slice(0, maxChars);

	const scored = sections
		.map(([title, body]) => ({ score: scoreSection(query, title, body), title, body }))
		.sort((a, b) => b.score - a.score);

	const selected: string[] = [];
	let total = 0;
	for (const item of scored) {
		if (item.score <= 0 && selected.length) continue;
		const chunk = `## ${item.title}\n${item.body}`.trim();
		if (total + chunk.length > maxChars && selected.length) break;
		selected.push(chunk);
		total += chunk.length;
		if (total >= maxChars * 0.8) break;
	}
	return selected.length ? selected.join('\n\n') : full.slice(0, maxChars);
}
