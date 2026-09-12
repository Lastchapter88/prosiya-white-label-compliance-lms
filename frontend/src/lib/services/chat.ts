import { chatConfig } from '$lib/config/chat';

export type ChatRole = 'user' | 'assistant';

export interface ChatHistoryItem {
	role: ChatRole;
	content: string;
}

export interface ChatLead {
	name?: string;
	company?: string;
	email?: string;
	phone?: string;
	location?: string;
	service?: string;
	requirements?: string;
	preferredContactMethod?: string;
}

export interface ChatApiResponse {
	conversationId: string;
	message: string;
	lead?: ChatLead | null;
	handoffSuggested?: boolean;
	error?: string;
}

export interface SendChatParams {
	conversationId: string | null;
	message: string;
	history: ChatHistoryItem[];
	lead?: ChatLead | null;
}

export class ChatClientError extends Error {
	status: number;

	constructor(message: string, status = 500) {
		super(message);
		this.status = status;
	}
}

export async function sendChatMessage(params: SendChatParams): Promise<ChatApiResponse> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 55_000);

	try {
		const response = await fetch(chatConfig.apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				conversationId: params.conversationId,
				message: params.message,
				history: params.history.slice(-12),
				lead: params.lead || undefined
			}),
			signal: controller.signal
		});

		let data: ChatApiResponse;
		try {
			data = await response.json();
		} catch {
			throw new ChatClientError(
				"Sorry, I'm having trouble connecting right now. Please try again or contact ProSiya directly.",
				response.status
			);
		}

		if (!response.ok) {
			throw new ChatClientError(
				data.error ||
					"Sorry, I'm having trouble connecting right now. Please try again or contact ProSiya directly.",
				response.status
			);
		}

		if (!data.message || !data.conversationId) {
			throw new ChatClientError(
				"Sorry, I'm having trouble connecting right now. Please try again or contact ProSiya directly."
			);
		}

		return data;
	} catch (err) {
		if (err instanceof ChatClientError) throw err;
		throw new ChatClientError(
			"Sorry, I'm having trouble connecting right now. Please try again or contact ProSiya on +27 78 523 6606."
		);
	} finally {
		clearTimeout(timeout);
	}
}
