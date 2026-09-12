export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export class AIServiceError extends Error {
	statusCode?: number;
	constructor(message: string, statusCode?: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export async function qwenChat(
	messages: ChatMessage[],
	opts: {
		apiKey: string;
		model: string;
		baseUrl: string;
		maxTokens?: number;
		temperature?: number;
	}
): Promise<string> {
	if (!opts.apiKey) {
		throw new AIServiceError(
			'Thanks for your message — our AI assistant is temporarily unavailable. Please contact ProSiya on +27 78 523 6606 or email dladla.siya@gmail.com and the team will gladly help.',
			503
		);
	}

	const url = `${opts.baseUrl.replace(/\/$/, '')}/chat/completions`;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 45_000);

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${opts.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: opts.model,
				messages,
				max_tokens: opts.maxTokens ?? 512,
				temperature: opts.temperature ?? 0.35
			}),
			signal: controller.signal
		});

		if (!res.ok) {
			throw new AIServiceError('The assistant service returned an error.', res.status);
		}

		const data = (await res.json()) as {
			choices?: Array<{ message?: { content?: string } }>;
		};
		const content = data.choices?.[0]?.message?.content;
		if (typeof content !== 'string' || !content.trim()) {
			throw new AIServiceError('Received an invalid response from the assistant service.');
		}
		return content.trim();
	} catch (err) {
		if (err instanceof AIServiceError) throw err;
		if (err instanceof Error && err.name === 'AbortError') {
			throw new AIServiceError('The assistant service timed out. Please try again.');
		}
		throw new AIServiceError('The assistant service is temporarily unavailable.');
	} finally {
		clearTimeout(timer);
	}
}
