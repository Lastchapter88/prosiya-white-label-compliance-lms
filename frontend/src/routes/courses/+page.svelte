<script lang="ts">
	import { Header, Footer, CourseCard } from '$lib/components';
	import { courseCatalogue } from '$lib/data/courses';

	const courses = courseCatalogue.map((course) => ({
		...course,
		href: `/courses/${course.slug}`,
		features: [...course.features]
	}));
</script>

<svelte:head>
	<title>Programmes — ProSiya Group</title>
	<meta name="description" content="Explore ProSiya’s professional security and firearm programmes, from Grades E, D and C through armed response, CIT, CPO and firearm competency." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="courses-hero">
			<div class="container">
				<p class="eyebrow">Professional security & firearm training</p>
				<h1 class="page-title">Our programmes</h1>
				<p class="page-subtitle">
					Choose a professional starting point, review the programme details, and follow the path into your next stage of training with ProSiya Group.
				</p>
			</div>
		</section>

		<section class="courses-section">
			<div class="container">
				<div class="courses-grid">
					{#each courses as course}
						<CourseCard
							title={course.title}
							image={course.image}
							category={course.category}
							description={course.short_description}
							features={course.features}
							href={course.href}
							price={course.price}
							currency={course.currency}
						/>
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
	.courses-hero {
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
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}
	.eyebrow { margin: 0 0 .6rem; color: var(--color-accent-dark, var(--color-navy-dark)); font-size: .75rem; font-weight: 800; letter-spacing: .14em; text-align: center; text-transform: uppercase; }
	.courses-section {
		padding: 2rem 0 4rem;
	}
	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}
	@media (max-width: 768px) {
		.page-title { font-size: 1.5rem; }
		.courses-grid { grid-template-columns: 1fr; }
	}
</style>
