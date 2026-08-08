<script lang="ts">
	import { Header, Footer } from '$lib/components';

	const accreditationBadges = [
		{ src: '/images/badges/psira.png', alt: 'PSIRA Accredited', name: 'PSIRA' },
		{ src: '/images/badges/qcto.png', alt: 'QCTO Quality Assured', name: 'QCTO' },
		{ src: '/images/badges/sasseta.png', alt: 'SASSETA Accredited', name: 'SASSETA' },
		{ src: '/images/badges/firearm%20accreditation.png', alt: 'Firearm Accreditation', name: 'Firearm Accreditation' },
		{ src: '/images/badges/SAPS.png', alt: 'SAPS', name: 'SAPS' }
	];
</script>

<svelte:head>
	<title>Accreditation - ProSiya LMS</title>
	<meta name="description" content="ProSiya Academy is an accredited training provider. PSIRA, QCTO, SASSETA and other recognised accreditations." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="accreditation-section">
			<div class="container">
				<h1 class="page-title">Accredited Training Provider</h1>
				<p class="page-subtitle">
					ProSiya Academy is recognised by the following bodies. Our programmes meet the required standards for security and firearms training.
				</p>
				<div class="badges-grid">
					{#each accreditationBadges as badge}
						<div class="badge-card">
							<img src={badge.src} alt={badge.alt} class="badge-img" />
							<span class="badge-name">{badge.name}</span>
						</div>
					{/each}
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
	.accreditation-section {
		padding: 3rem 0 4rem;
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
		margin: 0 auto 3rem;
		line-height: 1.6;
	}
	.badges-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 2rem;
		justify-items: center;
		align-items: start;
	}
	.badge-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		transition: box-shadow 0.2s ease;
	}
	.badge-card:hover {
		box-shadow: var(--shadow-card-hover);
	}
	.badge-img {
		height: 80px;
		width: auto;
		object-fit: contain;
	}
	.badge-name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-navy-dark);
		text-align: center;
	}
	@media (max-width: 768px) {
		.page-title { font-size: 1.5rem; }
		.badges-grid { gap: 1.5rem; }
		.badge-img { height: 64px; }
	}
</style>
