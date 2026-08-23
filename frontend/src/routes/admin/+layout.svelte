<script>
	import { auth, isAppAdmin } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	$: if (!$auth.loading && !$auth.isAuthenticated) {
		if (typeof window !== 'undefined') goto('/login?redirect=/admin/dashboard');
	}

	$: if (!$auth.loading && $auth.isAuthenticated && !isAppAdmin($auth.user)) {
		if (typeof window !== 'undefined') goto('/student/dashboard');
	}
</script>

{#if $auth.loading}
	<div class="loading-container">
		<div class="loader"></div>
		<p>Accessing admin console...</p>
	</div>
{:else if $auth.isAuthenticated && isAppAdmin($auth.user)}
	<slot />
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: #f8fafc;
		color: #64748b;
		font-family: inherit;
	}
	.loader {
		border: 4px solid #e2e8f0;
		border-top: 4px solid #dc2626;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
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
