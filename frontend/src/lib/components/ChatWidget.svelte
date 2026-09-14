<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { chatConfig } from '$lib/config/chat';
	import {
		sendChatMessage,
		type ChatHistoryItem,
		type ChatLead
	} from '$lib/services/chat';
	import { companyContact } from '$lib/data/companyProfile';
	import { page } from '$app/stores';
	import { chatOpen } from '$lib/stores/chatUi';

	type UiMessage = {
		id: string;
		role: 'user' | 'assistant';
		content: string;
	};

	let input = '';
	let sending = false;
	let error: string | null = null;
	let conversationId: string | null = null;
	let lead: ChatLead | null = null;
	let messages: UiMessage[] = [];
	let panelEl: HTMLElement | null = null;
	let messagesEl: HTMLDivElement | null = null;
	let inputEl: HTMLTextAreaElement | null = null;

	$: open = $chatOpen;
	$: studentPortal = $page.url.pathname.startsWith('/student');
	$: if (open) {
		tick().then(() => inputEl?.focus());
		scrollToBottom();
	}

	onMount(() => {
		try {
			const raw = sessionStorage.getItem(chatConfig.storageKey);
			if (raw) {
				const parsed = JSON.parse(raw);
				const restored = Array.isArray(parsed.messages) ? parsed.messages : [];
				const staleComingSoon = restored.some(
					(m: UiMessage) =>
						typeof m?.content === 'string' && /coming soon/i.test(m.content)
				);
				if (!staleComingSoon) {
					conversationId = parsed.conversationId || null;
					lead = parsed.lead || null;
					if (restored.length) messages = restored;
				} else {
					sessionStorage.removeItem(chatConfig.storageKey);
				}
			}
		} catch {
			/* ignore corrupt session */
		}

		if (messages.length === 0) {
			messages = [
				{
					id: 'welcome',
					role: 'assistant',
					content: chatConfig.welcomeMessage
				}
			];
		}
	});

	function persist() {
		try {
			sessionStorage.setItem(
				chatConfig.storageKey,
				JSON.stringify({ conversationId, lead, messages })
			);
		} catch {
			/* ignore quota */
		}
	}

	async function scrollToBottom() {
		await tick();
		if (messagesEl) {
			messagesEl.scrollTop = messagesEl.scrollHeight;
		}
	}

	function toggle() {
		chatOpen.update((isOpen) => !isOpen);
		error = null;
	}

	function close() {
		chatOpen.set(false);
	}

	function historyForApi(): ChatHistoryItem[] {
		return messages
			.filter((m) => m.id !== 'welcome')
			.map((m) => ({ role: m.role, content: m.content }));
	}

	async function send() {
		const text = input.trim();
		if (!text || sending) return;
		if (text.length > chatConfig.maxMessageLength) {
			error = `Please keep messages under ${chatConfig.maxMessageLength} characters.`;
			return;
		}

		error = null;
		input = '';
		messages = [...messages, { id: `u-${Date.now()}`, role: 'user', content: text }];
		sending = true;
		persist();
		await scrollToBottom();

		try {
			const result = await sendChatMessage({
				conversationId,
				message: text,
				history: historyForApi().slice(0, -1),
				lead
			});
			conversationId = result.conversationId;
			if (result.lead) lead = result.lead;
			messages = [
				...messages,
				{ id: `a-${Date.now()}`, role: 'assistant', content: result.message }
			];
			persist();
		} catch (e: any) {
			error = e?.message || 'Something went wrong. Please try again.';
		} finally {
			sending = false;
			await scrollToBottom();
			inputEl?.focus();
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			send();
		}
	}
</script>

<div class="chat-root" class:student={studentPortal}>
	{#if open}
		<section
			class="chat-panel"
			bind:this={panelEl}
			role="dialog"
			aria-modal="false"
			aria-label="ProSiya AI assistant"
		>
			<header class="chat-header">
				<div class="header-left">
					<div class="avatar" aria-hidden="true">P</div>
					<div>
						<strong>ProSiya Assistant</strong>
						<p>Security &amp; training help</p>
					</div>
				</div>
				<button type="button" class="icon-btn" aria-label="Close chat" on:click={close}>×</button>
			</header>

			<div class="chat-messages" bind:this={messagesEl} aria-live="polite">
				{#each messages as message (message.id)}
					<div class="bubble-row" class:user={message.role === 'user'}>
						{#if message.role === 'assistant'}
							<div class="avatar sm" aria-hidden="true">P</div>
						{/if}
						<div class="bubble" class:user={message.role === 'user'}>
							{message.content}
						</div>
					</div>
				{/each}

				{#if sending}
					<div class="bubble-row">
						<div class="avatar sm" aria-hidden="true">P</div>
						<div class="bubble typing" aria-label="Assistant is typing">
							<span></span><span></span><span></span>
						</div>
					</div>
				{/if}
			</div>

			{#if error}
				<div class="chat-error" role="alert">{error}</div>
			{/if}

			<form class="chat-input" on:submit|preventDefault={send}>
				<label class="sr-only" for="prosiya-chat-input">Message</label>
				<textarea
					id="prosiya-chat-input"
					bind:this={inputEl}
					bind:value={input}
					rows="1"
					maxlength={chatConfig.maxMessageLength}
					placeholder="Ask about security or training…"
					disabled={sending}
					on:keydown={onKeydown}
				></textarea>
				<button type="submit" class="send-btn" disabled={sending || !input.trim()} aria-label="Send message">
					Send
				</button>
			</form>

			<p class="chat-footer">
				Prefer a person?
				<a href="tel:{companyContact.phoneTel}">{companyContact.phone}</a>
				·
				<a href="mailto:{companyContact.email}">Email us</a>
			</p>
		</section>
	{/if}

	<button
		type="button"
		class="chat-fab"
		aria-label={open ? 'Close ProSiya assistant' : 'Open ProSiya assistant'}
		aria-expanded={open}
		on:click={toggle}
	>
		{#if open}
			×
		{:else}
			<span class="fab-label">Chat</span>
		{/if}
	</button>
</div>

<style>
	.chat-root {
		position: fixed;
		right: 1.25rem;
		bottom: 1.25rem;
		z-index: 1200;
		font-family: var(--font-sans);
	}

	.chat-fab {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 999px;
		border: none;
		background: var(--color-accent);
		color: var(--color-navy-dark);
		font-weight: 800;
		box-shadow: var(--shadow-lg);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.35rem;
		transition: transform 0.2s ease, background 0.2s ease;
	}

	.chat-fab:hover {
		background: var(--color-accent-dark);
		transform: translateY(-2px);
	}

	.fab-label {
		font-size: 0.85rem;
		letter-spacing: 0.02em;
	}

	.chat-panel {
		position: absolute;
		right: 0;
		bottom: 4.5rem;
		width: min(380px, calc(100vw - 1.5rem));
		height: min(560px, calc(100vh - 6.5rem));
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-modal);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
		background: var(--color-navy-dark);
		color: white;
	}

	html[data-theme='night'] .chat-header {
		background: #0f172a;
		border-bottom: 1px solid var(--color-border);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-left strong {
		display: block;
		font-size: 0.95rem;
	}

	.header-left p {
		margin: 0;
		font-size: 0.75rem;
		opacity: 0.85;
	}

	.avatar {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 999px;
		background: var(--color-accent);
		color: var(--color-navy-dark);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		flex-shrink: 0;
	}

	.avatar.sm {
		width: 1.75rem;
		height: 1.75rem;
		font-size: 0.8rem;
	}

	.icon-btn {
		background: transparent;
		border: none;
		color: white;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		width: 2rem;
		height: 2rem;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--color-bg-light);
	}

	.bubble-row {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		max-width: 100%;
	}

	.bubble-row.user {
		justify-content: flex-end;
	}

	.bubble {
		max-width: 80%;
		padding: 0.7rem 0.85rem;
		border-radius: 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		font-size: 0.92rem;
		line-height: 1.45;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.bubble.user {
		background: var(--color-navy-dark);
		color: white;
		border-color: transparent;
		border-bottom-right-radius: 0.3rem;
	}

	html[data-theme='night'] .bubble.user {
		background: #334155;
	}

	.bubble:not(.user) {
		border-bottom-left-radius: 0.3rem;
	}

	.typing {
		display: inline-flex;
		gap: 0.3rem;
		align-items: center;
		min-width: 3rem;
	}

	.typing span {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: var(--color-text-secondary);
		animation: bounce 1.2s infinite ease-in-out;
	}

	.typing span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			opacity: 0.35;
			transform: translateY(0);
		}
		40% {
			opacity: 1;
			transform: translateY(-3px);
		}
	}

	.chat-error {
		padding: 0.5rem 1rem;
		color: var(--color-error);
		font-size: 0.85rem;
		background: color-mix(in srgb, var(--color-error) 8%, transparent);
	}

	.chat-input {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem;
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.chat-input textarea {
		flex: 1;
		resize: none;
		min-height: 2.5rem;
		max-height: 6rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.6rem 0.75rem;
		font: inherit;
		background: var(--color-bg);
		color: var(--color-text);
	}

	.chat-input textarea:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 35%, transparent);
	}

	.send-btn {
		border: none;
		border-radius: var(--radius-md);
		background: var(--color-accent);
		color: var(--color-navy-dark);
		font-weight: 700;
		padding: 0 1rem;
		cursor: pointer;
	}

	.send-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.chat-footer {
		margin: 0;
		padding: 0.35rem 0.85rem 0.7rem;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-align: center;
		background: var(--color-surface);
	}

	.chat-footer a {
		color: var(--color-navy-dark);
		font-weight: 600;
	}

	html[data-theme='night'] .chat-footer a {
		color: var(--color-accent);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	@media (max-width: 480px) {
		.chat-root {
			right: 0.75rem;
			bottom: 0.9rem;
		}

		.chat-panel {
			width: calc(100vw - 1.5rem);
			height: min(70vh, calc(100vh - 5.5rem));
		}

		.chat-fab { width: 3rem; height: 3rem; }
	}

	@media (max-width: 959px) {
		.chat-root.student .chat-fab {
			display: none;
		}

		.chat-root.student {
			right: 0.75rem;
			left: 0.75rem;
			bottom: calc(5.6rem + env(safe-area-inset-bottom));
		}

		.chat-root.student .chat-panel {
			width: 100%;
			bottom: 0;
			height: min(62vh, calc(100vh - 11rem));
		}
	}
</style>
