<script lang="ts">
	import { Header, Footer } from '$lib/components';
</script>

<svelte:head>
	<title>POPIA Compliance - ProSiya LMS</title>
</svelte:head>

<div class="page">
	<Header />
	<main class="main">
		<section class="legal">
			<div class="container">
				<h1>POPIA Compliance</h1>
				<p>
					ProSiya Academy processes personal information in accordance with South Africa’s Protection of Personal Information Act (POPIA)
					for training administration, compliance records and learner support.
				</p>
				<p>
					To exercise your information rights, contact
					<a href="mailto:dladla.siya@gmail.com">dladla.siya@gmail.com</a>
					or <a href="tel:+27785236606">+27 78 523 6606</a> (Durban).
				</p>
			</div>
		</section>
	</main>
	<Footer />
</div>

<style>
	.page { display: flex; flex-direction: column; min-height: 100vh; }
	.main { flex: 1; }
	.legal { padding: 3rem 0 4rem; }
	.container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
	h1 { color: var(--color-navy-dark); margin-bottom: 1rem; }
	p { color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1rem; }
	a { color: var(--color-navy-dark); font-weight: 600; }
</style>
