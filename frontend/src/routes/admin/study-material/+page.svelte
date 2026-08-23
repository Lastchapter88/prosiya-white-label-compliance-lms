<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, isAppAdmin } from '$lib/stores/auth';
	import { Sidebar, Button } from '$lib/components';

	onMount(() => {
		if (!isAppAdmin($auth.user)) {
			goto('/login?redirect=/admin/study-material');
			return;
		}
	});
</script>

<svelte:head>
	<title>Study Material Access - ProSiya Admin</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar
		userRole="admin"
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>

	<main class="dashboard-main">
		<div class="panel">
			<h1>Study material access</h1>
			<p>
				Learner access to study materials is now managed through payment status on the
				<strong>Registered Users</strong> page. Mark a learner as <strong>Paid</strong> after
				confirming their course payment to unlock downloads instantly.
			</p>
			<Button href="/admin/users" variant="accent">Go to Registered Users</Button>
		</div>
	</main>
</div>

<style>
	.dashboard-layout {
		display: flex;
		min-height: 100vh;
		background: var(--color-bg-light);
	}
	.dashboard-main {
		margin-left: 280px;
		flex: 1;
		padding: 2rem;
	}
	.panel {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 2rem;
		max-width: 640px;
	}
	h1 {
		margin: 0 0 1rem;
		color: var(--color-navy-dark);
	}
	p {
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0 0 1.5rem;
	}
	@media (max-width: 1024px) {
		.dashboard-main {
			margin-left: 0;
		}
	}
</style>
