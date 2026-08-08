<script lang="ts">
	import { Header, Footer, Badge, Button, Modal } from '$lib/components';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { courseService } from '$lib/services/courses';
	import { courseCatalogue } from '$lib/data/courses';
	import { auth } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';
	
	let course: any = null;
	let isLoading = true;
	let error: string | null = null;
	let enrollLoading = false;
	let showEnrollSuccess = false;

	function catalogueCourse(slug: string) {
		const match = courseCatalogue.find((item) => item.slug === slug);
		if (!match) return null;
		return {
			id: match.slug,
			title: match.title,
			slug: match.slug,
			description: match.short_description,
			short_description: match.short_description,
			category: match.category,
			level: match.level,
			duration_hours: 40,
			price: match.price,
			currency: match.currency,
			cover_image: match.image,
			features: match.features,
			modules: []
		};
	}

	onMount(async () => {
		const slug = ($page.params as any).slug;
		try {
			course = await courseService.getCourse(slug);
		} catch {
			course = catalogueCourse(slug);
			if (!course) {
				error = 'Course not found';
			}
		} finally {
			isLoading = false;
		}
	});

	async function handleEnroll() {
		if (!$auth.isAuthenticated) {
			window.location.href = `/login?redirect=/courses/${($page.params as any).slug}`;
			return;
		}

		enrollLoading = true;
		try {
			await courseService.enroll(course.id);
			showEnrollSuccess = true;
		} catch (e: any) {
			alert(e.message || 'Failed to enroll in course');
		} finally {
			enrollLoading = false;
		}
	}

	const accreditations = [
		{ name: 'PSIRA', logo: '/images/badges/psira.png' },
		{ name: 'QCTO', logo: '/images/badges/qcto.png' },
		{ name: 'SASSETA', logo: '/images/badges/sasseta.png' }
	];
</script>

<svelte:head>
	<title>{course?.title || 'Course Details'} - ProSiya LMS</title>
</svelte:head>

<div class="page">
	<Header />
	
	<main class="main">
		{#if isLoading}
			<div class="loading-state">
				<div class="loader"></div>
				<p>Loading course information...</p>
			</div>
		{:else if error}
			<div class="error-state">
				<h2>Oops!</h2>
				<p>{error}</p>
				<Button href="/courses" variant="outline">Back to Courses</Button>
			</div>
		{:else if course}
			<!-- Course Hero -->
			<section class="course-hero" in:fade>
				<div class="container">
					<div class="hero-content">
						<div class="hero-text">
                            <Badge variant="accent" className="mb-3">{course.category}</Badge>
							<h1 class="course-title">{course.title}</h1>
							<p class="course-subtitle">{course.short_description}</p>
							
							<div class="course-meta">
								<div class="meta-item">
									<span class="icon">📅</span>
									<span>{course.duration_hours} Hours</span>
								</div>
								<div class="meta-item">
									<span class="icon">📊</span>
									<span>{course.level}</span>
								</div>
								{#if course.psira_code}
									<div class="meta-item">
										<Badge variant="navy">{course.psira_code}</Badge>
									</div>
								{/if}
							</div>
							
							<div class="accreditation-badges">
								{#each accreditations as accreditation}
									<img src={accreditation.logo} alt={accreditation.name} class="badge-img" />
								{/each}
							</div>
						</div>
						
						<div class="hero-sidebar">
							<div class="enrollment-card">
								<img src={course.cover_image || '/images/courses/security-training.png'} alt={course.title} class="course-image" />
								
								<div class="enrollment-content">
									<div class="price-section">
										<span class="price-currency">{course.currency}</span>
										<span class="price">{course.price}</span>
									</div>
									
									<Button 
                                        variant="accent" 
                                        size="lg" 
                                        className="w-full mb-3"
                                        on:click={handleEnroll}
                                        disabled={enrollLoading}
                                    >
                                        {enrollLoading ? 'Enrolling...' : 'Enroll Now'}
                                    </Button>
									
									<div class="includes">
										<h4>This course includes:</h4>
										<ul>
											<li>✓ {course.duration_hours} Hours of content</li>
                                            {#if course.practical_hours > 0}
											    <li>✓ {course.practical_hours} Hours practical training</li>
                                            {/if}
											<li>✓ Lifetime access</li>
											<li>✓ Certificate of completion</li>
											<li>✓ Regulatory compliance support</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			<!-- Course Content -->
			<section class="course-content">
				<div class="container">
					<div class="content-grid">
						<div class="main-content">
							<!-- Course Description -->
							<div class="content-section">
								<h2>Course Overview</h2>
								<p class="description">{course.description}</p>
							</div>
							
							<!-- Course Curriculum -->
							<div class="content-section">
								<h2>Course Curriculum</h2>
								<div class="modules-list">
									{#each course.modules as module, index}
										<div class="module-item">
											<div class="module-header">
												<div class="module-info">
													<h3>
														Module {index + 1}: {module.title}
													</h3>
													<p class="module-meta">
														{module.lessons.length} lessons • {module.duration_hours} Hours
													</p>
												</div>
											</div>
                                            <div class="lessons-list">
                                                {#each module.lessons as lesson}
                                                    <div class="lesson-item">
                                                        <span class="lesson-icon">
                                                            {lesson.lesson_type === 'video' ? '▶️' : '📄'}
                                                        </span>
                                                        <span class="lesson-title">{lesson.title}</span>
                                                        <span class="lesson-duration">{lesson.duration_minutes}m</span>
                                                    </div>
                                                {/each}
                                            </div>
										</div>
									{/each}
								</div>
							</div>
							
							<!-- Requirements -->
							<div class="content-section">
								<h2>Requirements</h2>
								<ul class="requirements-list">
									<li>Minimum Age: {course.min_age}</li>
                                    {#if course.requires_id_verification}
									    <li>Valid Identification Required</li>
                                    {/if}
                                    <li>English Proficiency</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
		{/if}
	</main>
	
	<Footer />

    <Modal 
        show={showEnrollSuccess} 
        title="Enrollment Successful!" 
        on:close={() => window.location.href = '/student/dashboard'}
    >
        <div class="success-message">
            <div class="success-icon">🎉</div>
            <p>You have successfully enrolled in <strong>{course?.title}</strong>.</p>
            <p>You can now start your learning journey from your dashboard.</p>
        </div>
        <div slot="footer">
            <Button on:click={() => window.location.href = '/student/dashboard'} variant="accent">Go to Dashboard</Button>
        </div>
    </Modal>
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
	
	.course-hero {
		background: white;
		padding: 3rem 0;
		border-bottom: 1px solid var(--color-border);
	}
	
	.hero-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 3rem;
	}
	
	.course-title {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 1rem;
		line-height: 1.2;
	}
	
	.course-subtitle {
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		margin-bottom: 2rem;
	}
	
	.course-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		margin-bottom: 2rem;
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text);
		font-weight: 600;
	}
	
	.icon { font-size: 1.25rem; }
	
	.accreditation-badges {
		display: flex;
		gap: 1.5rem;
		margin-top: 2rem;
	}
	
	.badge-img {
		height: 50px;
		width: auto;
		filter: grayscale(1);
		opacity: 0.7;
		transition: all 0.3s ease;
	}

    .badge-img:hover {
		filter: grayscale(0);
		opacity: 1;
	}
	
	.enrollment-card {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		overflow: hidden;
		position: sticky;
		top: 2rem;
		border: 1px solid var(--color-border);
	}
	
	.course-image {
		width: 100%;
		height: 220px;
		object-fit: cover;
	}
	
	.enrollment-content {
		padding: 2rem;
	}
	
	.price-section {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}
	
    .price-currency {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-secondary);
    }

	.price {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-navy-dark);
	}
	
	.includes h4 {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin: 2rem 0 1rem 0;
	}
	
	.includes ul {
		list-style: none;
		padding: 0;
	}
	
	.includes li {
		padding: 0.5rem 0;
		color: var(--color-text-secondary);
		font-size: 0.95rem;
	}
	
	.course-content {
		padding: 3rem 0;
	}
	
	.content-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
	}
	
	.content-section {
		background: white;
		padding: 2.5rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		margin-bottom: 2rem;
		border: 1px solid var(--color-border);
	}
	
	.content-section h2 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 1.5rem;
	}
	
	.description {
		line-height: 1.8;
		color: var(--color-text);
		white-space: pre-line;
	}
	
	.modules-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.module-item {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	
	.module-header {
		padding: 1.25rem 1.5rem;
		background: var(--color-bg-light);
	}
	
	.module-info h3 {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.25rem;
	}
	
	.module-meta {
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}

    .lessons-list {
        background: white;
    }

    .lesson-item {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border);
        gap: 1rem;
    }

    .lesson-title {
        flex: 1;
        font-weight: 500;
    }

    .lesson-duration {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
    }
	
	.requirements-list {
		list-style: none;
		padding: 0;
	}
	
	.requirements-list li {
		padding: 0.75rem 0;
		padding-left: 2rem;
		position: relative;
		color: var(--color-text);
	}
	
	.requirements-list li::before {
		content: '•';
		position: absolute;
		left: 0.5rem;
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.5rem;
        top: 0.4rem;
	}

    .loading-state, .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        text-align: center;
        gap: 1.5rem;
    }

    .loader {
		border: 4px solid var(--color-bg-light);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}

    .success-message {
        text-align: center;
        padding: 1rem 0;
    }

    .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.hero-content { grid-template-columns: 1fr; }
		.hero-sidebar { order: -1; }
		.enrollment-card { position: static; }
	}
</style>
