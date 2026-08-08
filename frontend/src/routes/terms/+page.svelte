<script lang="ts">
	import { Header, Footer } from '$lib/components';
</script>

<svelte:head>
	<title>Terms of Service - ProSiya LMS</title>
</svelte:head>

<div class="page">
	<Header />
	<main class="main">
		<section class="legal">
			<div class="container">
				<h1>Terms of Service</h1>
				<p>
					By using the ProSiya LMS you agree to use the platform for lawful training purposes, provide accurate information,
					and follow academy policies for assessments, practicals and certification.
				</p>
				<p>
					For enrolment terms and course-specific conditions, contact
					<a href="mailto:info@prosiya.co.za">info@prosiya.co.za</a>
					or call <a href="tel:+27785236606">+27 78 523 6606</a>.
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
