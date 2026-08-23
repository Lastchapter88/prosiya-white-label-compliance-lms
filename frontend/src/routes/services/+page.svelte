<script lang="ts">
	import { Header, Footer } from '$lib/components';
	import { companyContact, securityServices } from '$lib/data/companyProfile';
</script>

<svelte:head>
	<title>Security Services - ProSiya Group</title>
	<meta
		name="description"
		content="Integrated security services from ProSiya Group: guarding, VIP protection, mobile patrols, armed response, investigations, and more."
	/>
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="hero">
			<div class="container">
				<h1 class="page-title">Security Services</h1>
				<p class="page-lead">
					Beyond training, ProSiya Group delivers integrated security solutions for businesses,
					events, and communities across South Africa.
				</p>
				<p class="page-note">
					Looking for accredited courses? <a href="/courses">View our training programmes →</a>
				</p>
			</div>
		</section>

		<section class="services-section">
			<div class="container">
				<div class="services-grid">
					{#each securityServices as service}
						<article class="service-card">
							<h2>{service.title}</h2>
							<p>{service.description}</p>
						</article>
					{/each}
				</div>

				<div class="cta-box">
					<h2>Need a tailored security solution?</h2>
					<p>Contact our team to discuss guarding, response, or event security for your operation.</p>
					<p class="cta-contact">
						<a href="tel:{companyContact.phoneTel}">{companyContact.phone}</a>
						<span aria-hidden="true"> · </span>
						<a href="mailto:{companyContact.email}">{companyContact.email}</a>
					</p>
					<a href="/contact" class="btn btn-accent">Contact ProSiya</a>
				</div>
			</div>
		</section>
	</main>

	<Footer />
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.main {
		flex: 1;
	}
	.hero {
		padding: 3rem 0 2rem;
		background: var(--color-bg-light);
		text-align: center;
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	.page-lead {
		max-width: 640px;
		margin: 0 auto;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	.page-note {
		margin: 1rem auto 0;
		color: var(--color-text-secondary);
	}
	.page-note a {
		color: var(--color-accent-dark, var(--color-navy-dark));
		font-weight: 600;
		text-decoration: none;
	}
	.page-note a:hover {
		text-decoration: underline;
	}
	.services-section {
		padding: 2.5rem 0 4rem;
	}
	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}
	.service-card {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 1.5rem;
	}
	.service-card h2 {
		margin: 0 0 0.75rem;
		font-size: 1.125rem;
		color: var(--color-navy-dark);
	}
	.service-card p {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	.cta-box {
		text-align: center;
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 2rem;
	}
	.cta-box h2 {
		margin: 0 0 0.5rem;
		color: var(--color-navy-dark);
	}
	.cta-box p {
		margin: 0 0 1.25rem;
		color: var(--color-text-secondary);
	}
	.cta-contact {
		font-weight: 600;
	}
	.cta-contact a {
		color: var(--color-navy-dark);
		text-decoration: none;
	}
	.cta-contact a:hover {
		text-decoration: underline;
	}
	.btn {
		display: inline-block;
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		text-decoration: none;
		background: var(--color-accent);
		color: var(--color-navy-dark);
	}
</style>
