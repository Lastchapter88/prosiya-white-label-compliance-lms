<script lang="ts">
	import { Header, Footer, CourseCard } from '$lib/components';
	import { onMount } from 'svelte';
	import { api } from '$lib/services/api';
	import { courseCatalogue } from '$lib/data/courses';

	interface Course {
		id: string;
		title: string;
		slug: string;
		cover_image: string | null;
		short_description: string;
		category: string;
		level: string;
		price?: number | string;
		currency?: string;
	}

	const catalogueFallback = courseCatalogue.map((course) => ({
		title: course.title,
		image: course.image,
		features: [...course.features],
		href: `/courses/${course.slug}`,
		price: course.price,
		currency: course.currency
	}));

	let courses: any[] = catalogueFallback;
	let isLoading = true;

	onMount(async () => {
		try {
			const response = await api.get('/courses/list/');
			// Handle implementation specifics of pagination vs list
			const results = response.results || response;

			if (Array.isArray(results) && results.length > 0) {
				courses = results.map((c: Course) => ({
					title: c.title,
					image: c.cover_image || '/images/courses/security-training.png',
					features: [
						c.category,
						`Level: ${c.level}`,
						c.short_description
					],
					href: `/courses/${c.slug}`,
					price: c.price != null ? Number(c.price) : null,
					currency: c.currency || 'ZAR'
				}));
			}
		} catch (error) {
			console.error('Failed to load courses:', error);
			courses = catalogueFallback;
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>ProSiya LMS - Professional Security & Firearms Training</title>
	<meta name="description" content="Compliance-grade training platform for security and firearms professionals. PSIRA, QCTO, and SASSETA accredited." />
</svelte:head>

<div class="page">
	<Header />
	
	<main class="main">
		<!-- Hero Section -->
		<section class="hero">
			<div class="container">
				<div class="hero-content">
					<div class="hero-text">
						<h1 class="hero-title">Professional Security & Firearm Training</h1>
						<p class="hero-subtitle">Compliance-grade training for the security industry</p>
						
						<!-- Accreditation Badges -->
						<div class="accreditation-badges">
							<img src="/images/badges/psira.png" alt="PSIRA Accredited" class="badge" />
							<img src="/images/badges/qcto.png" alt="QCTO Certified" class="badge" />
							<img src="/images/badges/sasseta.png" alt="SASSETA Accredited" class="badge" />
						</div>
						
						<!-- Course Highlights -->
						<ul class="highlights">
							<li>Combined Grades E, D & C — R1,950</li>
							<li>Armed Response & CIT — R1,600</li>
							<li>CPO — R16,750</li>
							<li>Firearm Competency — from R2,650</li>
						</ul>
						
						<div class="hero-cta">
							<a href="/enroll" class="btn btn-accent btn-lg">Get Started</a>
							<a href="/courses" class="btn btn-outline btn-lg">View Courses</a>
						</div>
					</div>
					
					<div class="hero-image">
						<img src="/images/instructors/instructor-1.png" alt="Professional Instructor" />
					</div>
				</div>
			</div>
		</section>
		
		<!-- Courses Section -->
		<section class="courses-section">
			<div class="container">
				<div class="section-header">
					<h2 class="section-title">Our Courses</h2>
					<p class="section-subtitle">Professional training programs accredited by PSIRA, QCTO, and SASSETA</p>
				</div>
				
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
		
		<!-- Why Choose Us Section -->
		<section class="why-section">
			<div class="container">
				<h2 class="section-title">Why Choose ProSiya?</h2>
				
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">🎯</div>
						<h3>Regulator-Ready</h3>
						<p>Fully compliant with PSIRA, QCTO, and SASSETA requirements</p>
					</div>
					
					<div class="feature-card">
						<div class="feature-icon">🔒</div>
						<h3>Audit-Defensible</h3>
						<p>Court-grade evidence trails and compliance documentation</p>
					</div>
					
					<div class="feature-card">
						<div class="feature-icon">👨‍🏫</div>
						<h3>Expert Instructors</h3>
						<p>Certified professionals with years of industry experience</p>
					</div>
					
					<div class="feature-card">
						<div class="feature-icon">📱</div>
						<h3>Flexible Learning</h3>
						<p>Online theory combined with practical hands-on training</p>
					</div>
				</div>
			</div>
		</section>
	</main>
	
	<Footer />
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--color-bg-light);
	}
	
	.main {
		flex: 1;
	}
	
	/* Hero Section */
	.hero {
		background: white;
		padding: 4rem 0;
	}
	
	.hero-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: center;
	}
	
	.hero-title {
		font-size: 3rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 1rem;
		line-height: 1.2;
	}
	
	.hero-subtitle {
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}
	
	/* Accreditation Badges */
	.accreditation-badges {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}
	
	.badge {
		height: 60px;
		width: auto;
		object-fit: contain;
	}
	
	/* Highlights List */
	.highlights {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem 0;
	}
	
	.highlights li {
		padding-left: 1.75rem;
		position: relative;
		margin-bottom: 0.75rem;
		color: var(--color-text);
		font-size: 1.05rem;
		font-weight: 500;
	}
	
	.highlights li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.25rem;
	}
	
	/* Hero CTA */
	.hero-cta {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	
	.btn {
		padding: 0.875rem 2rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		text-decoration: none;
		transition: all 0.3s ease;
		display: inline-block;
		text-align: center;
	}
	
	.btn-lg {
		padding: 1rem 2.5rem;
		font-size: 1.1rem;
	}
	
	.btn-accent {
		background: var(--color-accent);
		color: var(--color-navy-dark);
		border: 2px solid var(--color-accent);
	}
	
	.btn-accent:hover {
		background: var(--color-accent-dark);
		border-color: var(--color-accent-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}
	
	.btn-outline {
		background: transparent;
		color: var(--color-navy-dark);
		border: 2px solid var(--color-navy-dark);
	}
	
	.btn-outline:hover {
		background: var(--color-navy-dark);
		color: white;
		transform: translateY(-2px);
	}
	
	/* Hero Image */
	.hero-image {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.hero-image img {
		width: 100%;
		max-width: 400px;
		height: auto;
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
	}
	
	/* Courses Section */
	.courses-section {
		padding: 4rem 0;
	}
	
	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.section-title {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 1rem;
	}
	
	.section-subtitle {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		max-width: 600px;
		margin: 0 auto;
	}
	
	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}
	
	/* Why Section */
	.why-section {
		padding: 4rem 0;
		background: white;
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-top: 3rem;
	}
	
	.feature-card {
		text-align: center;
		padding: 2rem;
		background: var(--color-bg-light);
		border-radius: var(--radius-lg);
		transition: all 0.3s ease;
	}
	
	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-card-hover);
	}
	
	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	
	.feature-card h3 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	
	.feature-card p {
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0;
	}
	
	/* Responsive */
	@media (max-width: 1024px) {
		.hero-content {
			grid-template-columns: 1fr;
			gap: 3rem;
		}
		
		.hero-image {
			order: -1;
		}
		
		.hero-title {
			font-size: 2.5rem;
		}
	}
	
	@media (max-width: 640px) {
		.hero {
			padding: 2rem 0;
		}
		
		.hero-title {
			font-size: 2rem;
		}
		
		.section-title {
			font-size: 2rem;
		}
		
		.accreditation-badges {
			gap: 1rem;
		}
		
		.badge {
			height: 50px;
		}
		
		.courses-grid {
			grid-template-columns: 1fr;
		}
		
		.btn-lg {
			width: 100%;
		}
	}
</style>
