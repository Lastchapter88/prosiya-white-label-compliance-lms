<script lang="ts">
	import { StudentPortalShell } from '$lib/components';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: if (!$auth.loading && !$auth.isAuthenticated) {
		goto(`/login?redirect=${encodeURIComponent($page.url.pathname)}`);
	}

	$: showGreeting = $page.url.pathname === '/student/dashboard';
</script>

{#if $auth.loading}
	<div class="loading-container">
		<div class="loader"></div>
		<p>Opening your study portal…</p>
	</div>
{:else if $auth.isAuthenticated}
	<StudentPortalShell {showGreeting}>
		<slot />
	</StudentPortalShell>
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: var(--color-bg-light);
		color: var(--color-text-secondary);
		gap: 1rem;
	}

	.loader {
		border: 4px solid var(--color-border);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 48px;
		height: 48px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
