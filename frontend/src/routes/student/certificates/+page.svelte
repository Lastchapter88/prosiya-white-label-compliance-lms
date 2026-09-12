<script lang="ts">
	import { Button } from '$lib/components';
</script>

<svelte:head>
	<title>Certificates - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Certificates</p>
	<h1>Your awards</h1>
	<p>Completed courses and verified assessments will appear here.</p>
</div>

<div class="panel">
	<div class="icon" aria-hidden="true">🎓</div>
	<h2>No certificates yet</h2>
	<p>
		Finish the study pack and your academy assessment. ProSiya will issue certificates once results are
		verified.
	</p>
	<div class="actions">
		<Button href="/student/courses" variant="accent">Continue studying</Button>
		<Button href="/contact" variant="outline">Ask the academy</Button>
	</div>
</div>

<style>
	.page-head {
		margin-bottom: 1.2rem;
	}

	.kicker {
		margin: 0 0 0.3rem;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	h1 {
		margin: 0 0 0.35rem;
		color: var(--color-navy-dark);
		font-size: 1.7rem;
	}

	.page-head p:last-child {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.panel {
		background: var(--color-surface);
		border-radius: 1.2rem;
		box-shadow: var(--shadow-card);
		padding: 2rem 1.25rem;
		text-align: center;
		max-width: 560px;
	}

	.icon {
		font-size: 2.4rem;
		margin-bottom: 0.6rem;
	}

	h2 {
		margin: 0 0 0.45rem;
		color: var(--color-navy-dark);
	}

	.panel p {
		margin: 0 0 1.2rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		justify-content: center;
	}
</style>
