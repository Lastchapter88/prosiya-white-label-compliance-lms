import { AIServiceError } from './qwen';
import { FRIENDLY_ERROR, handleChat, ValidationError } from './service';

export interface Env {
	QWEN_API_KEY: string;
	QWEN_MODEL: string;
	QWEN_API_BASE_URL: string;
}

const ALLOWED_ORIGINS = new Set([
	'https://prosiya-e751a.web.app',
	'https://prosiya-e751a.firebaseapp.com',
	'https://www.prosiyagroup.co.za',
	'https://prosiyagroup.co.za',
	'http://localhost:5173',
	'http://localhost:4173',
	'http://127.0.0.1:5173'
]);

const rateBucket = new Map<string, number[]>();

function corsHeaders(origin: string | null): HeadersInit {
	const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://www.prosiyagroup.co.za';
	return {
		'Access-Control-Allow-Origin': allowed,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '3600',
		'Content-Type': 'application/json; charset=utf-8',
		Vary: 'Origin'
	};
}

function jsonResponse(payload: unknown, status: number, origin: string | null): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: corsHeaders(origin)
	});
}

function clientKey(request: Request, conversationId: string | null): string {
	const forwarded = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '';
	const ip = forwarded.split(',')[0]?.trim() || 'unknown';
	return `${ip}:${conversationId || 'new'}`;
}

function allowRequest(key: string, max = 20, windowMs = 60_000): boolean {
	const now = Date.now();
	const stamps = (rateBucket.get(key) || []).filter((t) => now - t < windowMs);
	if (stamps.length >= max) {
		rateBucket.set(key, stamps);
		return false;
	}
	stamps.push(now);
	rateBucket.set(key, stamps);
	return true;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get('Origin');

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders(origin) });
		}

		const url = new URL(request.url);
		if (url.pathname !== '/' && url.pathname !== '/api/chat' && url.pathname !== '/chat') {
			return jsonResponse({ error: 'Not found.' }, 404, origin);
		}

		if (request.method !== 'POST') {
			return jsonResponse({ error: 'Method not allowed.' }, 405, origin);
		}

		let payload: Record<string, unknown>;
		try {
			payload = (await request.json()) as Record<string, unknown>;
			if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
				return jsonResponse({ error: 'Invalid request body.' }, 400, origin);
			}
		} catch {
			return jsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
		}

		const conversationHint =
			typeof payload.conversationId === 'string' ? payload.conversationId : null;
		if (!allowRequest(clientKey(request, conversationHint))) {
			return jsonResponse(
				{ error: 'Too many requests. Please wait a moment and try again.' },
				429,
				origin
			);
		}

		try {
			const result = await handleChat(payload, {
				apiKey: env.QWEN_API_KEY || '',
				model: env.QWEN_MODEL || 'qwen-plus',
				baseUrl: env.QWEN_API_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
			});
			return jsonResponse(result, 200, origin);
		} catch (err) {
			if (err instanceof ValidationError) {
				return jsonResponse({ error: err.message }, err.statusCode, origin);
			}
			if (err instanceof AIServiceError) {
				const status = err.statusCode && err.statusCode >= 400 ? err.statusCode : 503;
				return jsonResponse({ error: err.message, message: err.message }, status, origin);
			}
			return jsonResponse({ error: FRIENDLY_ERROR }, 500, origin);
		}
	}
} satisfies ExportedHandler<Env>;
