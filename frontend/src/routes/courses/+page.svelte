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
	<title>Courses - ProSiya LMS</title>
	<meta name="description" content="Security Grades A–E and Armed Response training. Combined Grade E, D & C from R1,950. Accredited programmes by ProSiya." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="courses-hero">
			<div class="container">
				<h1 class="page-title">Our Courses</h1>
				<p class="page-subtitle">
					Professional security training programmes with clear pricing. Tap a course to view details — you’ll need to log in to see full content and enroll.
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
