import { writable } from 'svelte/store';

export const chatOpen = writable(false);

export function openChat() {
	chatOpen.set(true);
}

export function closeChat() {
	chatOpen.set(false);
}

export function toggleChat() {
	chatOpen.update((open) => !open);
}
