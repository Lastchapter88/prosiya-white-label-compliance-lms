<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { initAutoTheme } from '$lib/theme';
	import { ChatWidget } from '$lib/components';
	import { authService } from '$lib/services/auth';
	import { defaultPostAuthPath, waitForAuthUser } from '$lib/utils/authRedirect';

	let { children } = $props();

	onMount(() => {
		const stop = initAutoTheme();
		let cancelled = false;

		(async () => {
			try {
				const result = await authService.handleGoogleRedirect();
				if (cancelled) return;
				if (result.error) {
					sessionStorage.setItem('prosiya_auth_error', result.error);
					const path = window.location.pathname;
					if (path !== '/login' && path !== '/register') {
						await goto('/login');
					}
					return;
				}
				if (result.user) {
					const user = await waitForAuthUser();
					if (cancelled) return;
					const path = window.location.pathname;
					if (path === '/' || path === '/login' || path === '/register') {
						await goto(defaultPostAuthPath(user, result.redirectUrl));
					}
				}
			} catch (err) {
				console.error('Google redirect handling failed:', err);
			}
		})();

		return () => {
			cancelled = true;
			stop();
		};
	});
</script>

<div class="app">
	{@render children()}
	<ChatWidget />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 767px) {
		.app { padding-bottom: 4.25rem; }
	}
</style>
