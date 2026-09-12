/** Public chat client configuration (no secrets). */
export const chatConfig = {
	/** Live Qwen-backed assistant (API key stays on Cloudflare Worker). */
	comingSoon: false,
	comingSoonMessage:
		"Thanks for your message — our AI assistant is temporarily unavailable. Please contact ProSiya on +27 78 523 6606 or email dladla.siya@gmail.com.",
	/**
	 * Cloudflare Worker chat API. Override with VITE_CHAT_API_URL for local wrangler/dev.
	 * Updated after `wrangler deploy` with the workers.dev URL.
	 */
	apiUrl:
		(typeof import.meta !== 'undefined' && import.meta.env?.VITE_CHAT_API_URL) ||
		'https://prosiya-chat.tilesmirrored.workers.dev',
	maxMessageLength: 1500,
	welcomeMessage:
		"Hi! I'm ProSiya's AI assistant. Ask me about security training, courses, or how to get started — or contact us on +27 78 523 6606 / dladla.siya@gmail.com.",
	storageKey: 'prosiya_chat_session_v3'
} as const;
