<script lang="ts">
	import { Header, Footer } from '$lib/components';
</script>

<svelte:head>
	<title>Contact - ProSiya LMS</title>
	<meta name="description" content="Contact ProSiya Academy in Durban. Call +27 78 523 6606 or email info@prosiya.co.za." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="contact-hero">
			<div class="container">
				<h1 class="page-title">Contact Us</h1>
				<p class="page-subtitle">
					Get in touch with ProSiya Academy for course enquiries, bookings, and support.
				</p>
			</div>
		</section>

		<section class="contact-section">
			<div class="container">
				<div class="contact-grid">
					<div class="contact-card">
						<h2>Phone</h2>
						<p><a href="tel:+27785236606">+27 78 523 6606</a></p>
					</div>
					<div class="contact-card">
						<h2>Email</h2>
						<p><a href="mailto:info@prosiya.co.za">info@prosiya.co.za</a></p>
					</div>
					<div class="contact-card">
						<h2>Location</h2>
						<p>Durban, South Africa</p>
					</div>
				</div>

				<div class="contact-cta">
					<a href="/register" class="btn btn-accent">Get Started</a>
					<a href="/courses" class="btn btn-outline">View Courses</a>
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
	.contact-hero {
		padding: 2.5rem 0 2rem;
		background: var(--color-bg-light);
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		text-align: center;
		margin-bottom: 0.75rem;
	}
	.page-subtitle {
		text-align: center;
		color: var(--color-text-secondary);
		max-width: 560px;
		margin: 0 auto;
		line-height: 1.6;
	}
	.contact-section {
		padding: 2.5rem 0 4rem;
	}
	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}
	.contact-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg, 12px);
		padding: 1.5rem;
		text-align: center;
	}
	.contact-card h2 {
		margin: 0 0 0.75rem;
		font-size: 1.125rem;
		color: var(--color-navy-dark);
	}
	.contact-card p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 1.05rem;
	}
	.contact-card a {
		color: var(--color-navy-dark);
		text-decoration: none;
		font-weight: 600;
	}
	.contact-card a:hover {
		color: var(--color-accent-dark);
	}
	.contact-cta {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.btn {
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-md, 8px);
		font-weight: 700;
		text-decoration: none;
		display: inline-block;
	}
	.btn-accent {
		background: var(--color-accent);
		color: var(--color-navy-dark);
	}
	.btn-outline {
		border: 2px solid var(--color-navy-dark);
		color: var(--color-navy-dark);
	}
</style>
