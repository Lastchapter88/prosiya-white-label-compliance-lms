import { getRelevantContext } from './knowledge';
import { extractLeadSignals, leadFromDict, leadToDict, mergeLeads, type Lead } from './leads';
import { buildSystemMessage } from './prompts';
import { AIServiceError, qwenChat, type ChatMessage } from './qwen';

export const MAX_MESSAGE_LENGTH = 1500;
export const MAX_HISTORY_MESSAGES = 12;
export const MAX_HISTORY_CHARS = 6000;

export const FRIENDLY_ERROR =
	"Sorry, I'm having trouble connecting right now. Please try again or contact ProSiya on +27 78 523 6606 or email dladla.siya@gmail.com.";

export class ValidationError extends Error {
	statusCode = 400;
	constructor(message: string) {
		super(message);
	}
}

export type ChatResult = {
	conversationId: string;
	message: string;
	lead: Record<string, string> | null;
	handoffSuggested: boolean;
};

function validateMessage(message: unknown): string {
	if (typeof message !== 'string' || !message.trim()) {
		throw new ValidationError('Please enter a message.');
	}
	const cleaned = message.trim();
	if (cleaned.length > MAX_MESSAGE_LENGTH) {
		throw new ValidationError(`Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
	}
	return cleaned;
}

function validateConversationId(conversationId: unknown): string {
	if (conversationId == null || conversationId === '') {
		return crypto.randomUUID();
	}
	if (typeof conversationId !== 'string') {
		throw new ValidationError('Invalid conversationId.');
	}
	if (conversationId.length > 80 || !/^[A-Za-z0-9_-]+$/.test(conversationId)) {
		throw new ValidationError('Invalid conversationId.');
	}
	return conversationId;
}

function validateHistory(history: unknown): Array<{ role: 'user' | 'assistant'; content: string }> {
	if (history == null) return [];
	if (!Array.isArray(history)) throw new ValidationError('Invalid history.');

	const cleaned: Array<{ role: 'user' | 'assistant'; content: string }> = [];
	let totalChars = 0;
	for (const item of history.slice(-MAX_HISTORY_MESSAGES)) {
		if (!item || typeof item !== 'object') continue;
		const role = (item as { role?: unknown }).role;
		const content = (item as { content?: unknown }).content;
		if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue;
		const text = content.trim().slice(0, MAX_MESSAGE_LENGTH);
		if (!text) continue;
		totalChars += text.length;
		if (totalChars > MAX_HISTORY_CHARS) break;
		cleaned.push({ role, content: text });
	}
	return cleaned;
}

function sanitizeAssistantOutput(text: string): string {
	return text
		.replace(/\b(qwen|dashscope|alibaba|openai|chatgpt|claude|anthropic)\b/gi, 'our assistant platform')
		.trim();
}

function suggestsHandoff(userMessage: string, assistantMessage: string): boolean {
	const cues = [
		'speak to a human',
		'talk to someone',
		'real person',
		'call me',
		'quotation',
		'quote',
		'contact prosiya',
		"don't have enough information",
		'do not have verified',
		"don't currently have verified",
		'angifuni ukukhuluma ne-chatbot',
		'nomuntu wangempela',
		'angishayele',
		'management',
		'siyabonga dladla'
	];
	const blob = `${userMessage}\n${assistantMessage}`.toLowerCase();
	return cues.some((c) => blob.includes(c));
}

export async function handleChat(
	payload: Record<string, unknown>,
	env: { apiKey: string; model: string; baseUrl: string }
): Promise<ChatResult> {
	const message = validateMessage(payload.message);
	const conversationId = validateConversationId(payload.conversationId);
	const history = validateHistory(payload.history);
	const lead = mergeLeads(leadFromDict(payload.lead), extractLeadSignals(message));

	const knowledge = getRelevantContext(message);
	const system = buildSystemMessage(knowledge);

	const messages: ChatMessage[] = [
		{ role: 'system', content: system },
		...history,
		{ role: 'user', content: message }
	];

	let assistantText: string;
	try {
		assistantText = await qwenChat(messages, {
			apiKey: env.apiKey,
			model: env.model,
			baseUrl: env.baseUrl,
			maxTokens: 512,
			temperature: 0.35
		});
	} catch (err) {
		if (err instanceof AIServiceError) throw err;
		throw new AIServiceError(FRIENDLY_ERROR);
	}

	assistantText = sanitizeAssistantOutput(assistantText);
	return {
		conversationId,
		message: assistantText,
		lead: leadToDict(lead),
		handoffSuggested: suggestsHandoff(message, assistantText)
	};
}
