<script lang="ts">
	import { Header, Footer } from '$lib/components';
</script>

<svelte:head>
	<title>About ProSiya Group - ProSiya LMS</title>
	<meta name="description" content="ProSiya Group is a professional security and firearms training academy in South Africa. Learn about our mission, accreditations and compliance-grade programmes." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="about-hero">
			<div class="container">
				<h1 class="page-title">About ProSiya Group</h1>
				<p class="page-lead">
					Professional Security & Firearms Training Academy delivering compliance-grade training for the security industry in South Africa.
				</p>
			</div>
		</section>

		<section class="about-content">
			<div class="container">
				<div class="content-block">
					<h2>Who We Are</h2>
					<p>
						ProSiya Group is an accredited training provider specialising in security and firearms education. We prepare professionals for PSIRA registration, firearm competency, armed response, CIT and related fields through structured, regulator-aligned programmes.
					</p>
				</div>
				<div class="content-block">
					<h2>What We Do</h2>
					<p>
						We offer security grades E to A, firearm competency training, armed response and cash-in-transit (CIT) programmes, plus ongoing professional development. Our training combines online learning with practical instruction so learners meet industry and legal requirements.
					</p>
				</div>
				<div class="content-block">
					<h2>Our Standards</h2>
					<p>
						ProSiya Group is accredited by PSIRA, QCTO and SASSETA, and our courses are designed to meet the standards required by regulators and employers. We focus on compliance, safety and employability so that graduates are ready for the workplace.
					</p>
					<p class="cta-p">
						<a href="/accreditation" class="link-accent">View our accreditations →</a>
					</p>
				</div>
				<div class="content-block">
					<h2>Where We Operate</h2>
					<p>
						We are based in Durban, South Africa, and serve learners and organisations across the country. Our learning management system (LMS) supports both in-person and remote learning so you can train with us wherever you are.
					</p>
					<p>
						Contact: <a href="tel:+27785236606">+27 78 523 6606</a> ·
						<a href="mailto:info@prosiya.co.za">info@prosiya.co.za</a>
					</p>
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
	.about-hero {
		padding: 3rem 0 2rem;
		background: var(--color-bg-light);
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		text-align: center;
		margin-bottom: 0.75rem;
	}
	.page-lead {
		text-align: center;
		color: var(--color-text-secondary);
		max-width: 640px;
		margin: 0 auto;
		line-height: 1.6;
		font-size: 1.125rem;
	}
	.about-content {
		padding: 2.5rem 0 4rem;
	}
	.content-block {
		max-width: 720px;
		margin: 0 auto 2.5rem;
	}
	.content-block:last-child {
		margin-bottom: 0;
	}
	.content-block h2 {
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	.content-block p {
		color: var(--color-text);
		line-height: 1.7;
		margin-bottom: 1rem;
	}
	.content-block p:last-child {
		margin-bottom: 0;
	}
	.cta-p {
		margin-top: 1rem;
	}
	.link-accent {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.link-accent:hover {
		color: var(--color-accent-dark);
		text-decoration: underline;
	}
	@media (max-width: 768px) {
		.page-title { font-size: 1.5rem; }
		.page-lead { font-size: 1rem; }
	}
</style>
