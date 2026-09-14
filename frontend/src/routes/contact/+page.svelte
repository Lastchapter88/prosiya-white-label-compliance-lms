<script lang="ts">
	import { Header, Footer, PaymentInstructions } from '$lib/components';
	import { companyContact } from '$lib/data/companyProfile';
</script>

<svelte:head>
	<title>Contact - ProSiya LMS</title>
	<meta name="description" content="Contact ProSiya Group at 30 Wills Road, Durban. Call +27 78 523 6606 or email dladla.siya@gmail.com." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="contact-hero">
			<div class="container">
				<h1 class="page-title">Contact Us</h1>
				<p class="page-subtitle">
					Get in touch with ProSiya Group for training enrolments, security services, and general enquiries.
				</p>
			</div>
		</section>

		<section class="contact-section">
			<div class="container">
				<div class="contact-grid">
					<div class="contact-card">
						<h2>Phone</h2>
						<p><a href="tel:{companyContact.phoneTel}">{companyContact.phone}</a></p>
					</div>
					<div class="contact-card">
						<h2>Email</h2>
						<p><a href="mailto:{companyContact.email}">{companyContact.email}</a></p>
					</div>
					<div class="contact-card">
						<h2>Address</h2>
						<p>{companyContact.streetAddress}<br />{companyContact.city}, {companyContact.postalCode}<br />{companyContact.country}</p>
					</div>
				</div>

				<div class="payment-card">
					<h2>Course payment</h2>
					<p class="payment-intro">
						Complete your course fees, then send proof of payment so we can unlock your study materials.
					</p>
					<PaymentInstructions showHeading={false} />
				</div>

				<div class="contact-cta">
					<a href="/register" class="btn btn-accent">Get Started</a>
					<a href="/courses" class="btn btn-outline">View programmes</a>
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
	.payment-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg, 12px);
		padding: 1.75rem;
		margin-bottom: 2.5rem;
		max-width: 720px;
		margin-left: auto;
		margin-right: auto;
	}
	.payment-card h2 {
		margin: 0 0 0.5rem;
		font-size: 1.25rem;
		color: var(--color-navy-dark);
		text-align: center;
	}
	.payment-intro {
		margin: 0 0 1.25rem;
		color: var(--color-text-secondary);
		text-align: center;
		line-height: 1.6;
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
