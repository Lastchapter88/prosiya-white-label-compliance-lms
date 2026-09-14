<script lang="ts">
	import { Header, Footer } from '$lib/components';
	let { error } = $props();
</script>

<div class="page">
	<Header />
	<main class="main">
		<section class="error-box">
			<div class="container">
				<h1>{error?.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
				<p>
					{error?.status === 404
						? 'The page you requested does not exist.'
						: error?.message || 'Please try again.'}
				</p>
				<div class="actions">
					<a href="/" class="btn btn-accent">Home</a>
					<a href="/courses" class="btn btn-outline">Programmes</a>
					<a href="/contact" class="btn btn-outline">Contact</a>
				</div>
			</div>
		</section>
	</main>
	<Footer />
</div>

<style>
	.page { display: flex; flex-direction: column; min-height: 100vh; }
	.main { flex: 1; }
	.error-box { padding: 4rem 0; text-align: center; background: var(--color-bg-light); }
	h1 { color: var(--color-navy-dark); margin-bottom: 0.75rem; }
	p { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
	.actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
	.btn {
		padding: 0.875rem 1.5rem;
		border-radius: 8px;
		font-weight: 700;
		text-decoration: none;
	}
	.btn-accent { background: var(--color-accent); color: var(--color-navy-dark); }
	.btn-outline { border: 2px solid var(--color-navy-dark); color: var(--color-navy-dark); }
</style>
