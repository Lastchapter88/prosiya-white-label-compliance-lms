<script lang="ts">
	import { Header, Footer } from '$lib/components';
	import {
		companyContact,
		companyOverview,
		missionVisionValues,
		staffStandards,
		managementTeam
	} from '$lib/data/companyProfile';
</script>

<svelte:head>
	<title>About ProSiya Group - ProSiya LMS</title>
	<meta
		name="description"
		content="ProSiya Group is a 100% black-owned South African security and training organisation in Durban. Call {companyContact.phone} or email {companyContact.email}."
	/>
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="about-hero">
			<div class="container">
				<p class="eyebrow">{companyOverview.tagline}</p>
				<h1 class="page-title">About ProSiya Group</h1>
				<p class="page-lead">{companyOverview.positioning}</p>
			</div>
		</section>

		<section class="about-content">
			<div class="container">
				<div class="content-block">
					<h2>Who We Are</h2>
					<p>{companyOverview.context}</p>
					<p>
						Through our training academy, we prepare professionals for PSIRA registration, firearm
						competency, armed response, CIT, and related qualifications. Learn more about our
						<a href="/courses">course programmes</a> or our
						<a href="/services">operational security services</a>.
					</p>
				</div>

				<div class="content-grid">
					<div class="content-block card">
						<h2>Mission</h2>
						<ul>
							{#each missionVisionValues.mission as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
					<div class="content-block card">
						<h2>Vision</h2>
						<p>{missionVisionValues.vision}</p>
					</div>
				</div>

				<div class="content-block">
					<h2>Our Values</h2>
					<div class="values-grid">
						{#each missionVisionValues.values as value}
							<article class="value-card">
								<h3>{value.title}</h3>
								<p>{value.description}</p>
							</article>
						{/each}
					</div>
				</div>

				<div class="content-block">
					<h2>Staff Standards</h2>
					<p>{staffStandards.intro}</p>
					<ul>
						{#each staffStandards.points as point}
							<li>{point}</li>
						{/each}
					</ul>
				</div>

				<div class="content-block">
					<h2>Management Team</h2>
					<div class="team-grid">
						{#each managementTeam as member}
							<article class="team-card">
								<h3>{member.name}</h3>
								<p class="role">{member.role}</p>
								<p>{member.bio}</p>
							</article>
						{/each}
					</div>
				</div>

				<div class="content-block">
					<h2>Accreditation & Standards</h2>
					<p>
						Our training programmes align with PSIRA, QCTO, and SASSETA requirements. We focus on
						compliance, safety, and employability so graduates are ready for the workplace.
					</p>
					<p class="cta-p">
						<a href="/accreditation" class="link-accent">View our accreditations →</a>
					</p>
				</div>

				<div class="content-block contact-section">
					<h2>Contact Us</h2>
					<p class="contact-intro">
						We serve learners and clients nationwide, with in-person and online training supported
						through our LMS.
					</p>
					<div class="contact-grid">
						<div class="contact-card">
							<h3>Phone</h3>
							<p><a href="tel:{companyContact.phoneTel}">{companyContact.phone}</a></p>
						</div>
						<div class="contact-card">
							<h3>Email</h3>
							<p><a href="mailto:{companyContact.email}">{companyContact.email}</a></p>
						</div>
						<div class="contact-card">
							<h3>Address</h3>
							<p>
								{companyContact.streetAddress}<br />{companyContact.city}, {companyContact.postalCode}<br />{companyContact.country}
							</p>
						</div>
					</div>
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
		text-align: center;
	}
	.eyebrow {
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-accent-dark, var(--color-navy-dark));
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	.page-lead {
		color: var(--color-text-secondary);
		max-width: 720px;
		margin: 0 auto;
		line-height: 1.6;
		font-size: 1.125rem;
	}
	.about-content {
		padding: 2.5rem 0 4rem;
	}
	.content-block {
		max-width: 820px;
		margin: 0 auto 2.5rem;
	}
	.content-block h2 {
		font-size: 1.375rem;
		font-weight: 600;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	.content-block p,
	.content-block li {
		color: var(--color-text);
		line-height: 1.7;
	}
	.content-block ul {
		padding-left: 1.25rem;
	}
	.content-block a {
		color: var(--color-navy-dark);
		font-weight: 600;
	}
	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		max-width: 820px;
		margin: 0 auto 2.5rem;
	}
	.card {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 1.5rem;
		margin: 0;
	}
	.values-grid,
	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1rem;
	}
	.value-card,
	.team-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
	}
	.value-card h3,
	.team-card h3 {
		margin: 0 0 0.5rem;
		color: var(--color-navy-dark);
	}
	.role {
		margin: 0 0 0.75rem;
		color: var(--color-accent-dark, var(--color-navy-dark));
		font-weight: 600;
	}
	.cta-p {
		margin-top: 1rem;
	}
	.link-accent {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}
	.link-accent:hover {
		text-decoration: underline;
	}
	.contact-section {
		max-width: 820px;
	}
	.contact-intro {
		margin-bottom: 1.25rem;
	}
	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.contact-card {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem;
	}
	.contact-card h3 {
		margin: 0 0 0.5rem;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-secondary);
	}
	.contact-card p {
		margin: 0;
	}
	.contact-card a {
		color: var(--color-navy-dark);
		font-weight: 600;
		text-decoration: none;
	}
	.contact-card a:hover {
		text-decoration: underline;
	}
	@media (max-width: 768px) {
		.page-title {
			font-size: 1.5rem;
		}
		.page-lead {
			font-size: 1rem;
		}
	}
</style>
