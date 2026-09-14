<script lang="ts">
	import { Header, Footer, Badge, Button, Modal, PaymentInstructions } from '$lib/components';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { courseService } from '$lib/services/courses';
	import { courseCatalogue } from '$lib/data/courses';
	import { auth } from '$lib/stores/auth';
	import { enrollmentService } from '$lib/services/enrollments';
	import { studyMaterialService, type MaterialAccessStatus } from '$lib/services/studyMaterial';
	import { fade } from 'svelte/transition';
	
	let course: any = null;
	let isLoading = true;
	let error: string | null = null;
	let enrollLoading = false;
	let showEnrollSuccess = false;
	let accessStatus: MaterialAccessStatus | 'none' = 'none';

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
			duration_hours: null,
			theory_hours: null,
			practical_hours: null,
			min_age: null,
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

		if ($auth.user?.id && slug) {
			const access = await studyMaterialService.getAccess($auth.user.id, slug);
			accessStatus = access?.status || 'none';
		}
	});

	$: if ($auth.user?.id && course?.slug) {
		studyMaterialService.getAccess($auth.user.id, course.slug).then((access) => {
			accessStatus = access?.status || 'none';
		});
	}

	async function handleEnroll() {
		if ($auth.loading) return;
		if (!$auth.isAuthenticated) {
			window.location.href = `/login?redirect=/courses/${($page.params as any).slug}`;
			return;
		}

		enrollLoading = true;
		try {
			try {
				await courseService.enroll(course.id);
			} catch {
				// Backend may be offline on Firebase hosting — still queue study material access
			}

			const user = $auth.user;
			if (user?.id) {
				await enrollmentService.enroll({
					userId: user.id,
					userEmail: user.email || '',
					userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Student',
					courseSlug: course.slug,
					courseTitle: course.title
				});
			}

			showEnrollSuccess = true;
			accessStatus = 'pending';
		} catch (e: any) {
			alert(e.message || 'Failed to enroll in course');
		} finally {
			enrollLoading = false;
		}
	}

	$: accreditations = [
		{ name: 'PSIRA', code: course?.psira_code, logo: '/images/badges/psira.png' },
		{ name: 'QCTO', code: course?.qcto_code, logo: '/images/badges/qcto.png' },
		{ name: 'SASSETA', code: course?.sasseta_code, logo: '/images/badges/sasseta.png' }
	].filter((item) => item.code);
</script>

<svelte:head>
	<title>{course?.title || 'Programme Details'} - ProSiya Group</title>
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
				<Button href="/courses" variant="outline">Back to programmes</Button>
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
								{#if course.duration_hours != null}<div class="meta-item"><span class="icon">📅</span><span>{course.duration_hours} Hours</span></div>{/if}
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
								<img src={course.cover_image || '/images/courses/grade-c-security.jpg'} alt={course.title} class="course-image" />
								
								<div class="enrollment-content">
									<div class="price-section">
										<span class="price-currency">{course.currency}</span>
										<span class="price">{course.price}</span>
									</div>
									
									{#if accessStatus === 'approved'}
										<Button
											variant="accent"
											size="lg"
											className="w-full mb-3"
											href="/student/courses/{course.slug}"
										>
											Open authorised course
										</Button>
									{:else}
										<Button
											variant="accent"
											size="lg"
											className="w-full mb-3"
											on:click={handleEnroll}
											disabled={enrollLoading || accessStatus === 'pending'}
										>
											{enrollLoading
												? 'Submitting…'
												: accessStatus === 'pending'
													? 'Application submitted'
													: accessStatus === 'denied'
														? 'Apply again'
														: 'Apply to enrol'}
										</Button>
									{/if}

									<div class="payment-note">
										<p class="payment-note-title">
											{accessStatus === 'approved'
												? 'This course is unlocked'
												: 'Applying does not unlock the course'}
										</p>
										{#if accessStatus !== 'approved'}
											<PaymentInstructions variant="compact" showHeading={false} />
										{/if}
									</div>
									
									<div class="includes">
									<h4>Programme information</h4>
										<ul>
											{#if course.duration_hours != null}<li>✓ {course.duration_hours} total hours</li>{/if}
                                            {#if course.theory_hours != null}<li>✓ {course.theory_hours} theory hours</li>{/if}
                                            {#if course.practical_hours != null && course.practical_hours > 0}<li>✓ {course.practical_hours} practical hours</li>{/if}
											{#if course.min_age != null}<li>✓ Minimum age: {course.min_age}</li>{/if}
											{#if course.modules?.length}<li>✓ {course.modules.length} learning modules</li>{/if}
											{#if !course.duration_hours && !course.min_age && !course.modules?.length}<li>Programme details available from ProSiya during enrolment.</li>{/if}
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
								<h2>Programme overview</h2>
								<p class="description">{course.description}</p>
							</div>
							
							<!-- Course Curriculum -->
							<div class="content-section">
								<h2>What you will learn</h2>
								<div class="modules-list">
									{#if !course.modules?.length}<p class="empty-copy">Detailed modules will appear here when they are available for this programme. Contact ProSiya if you need help understanding the content before enrolling.</p>{/if}
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
									{#if course.min_age != null}<li>Minimum age: {course.min_age}</li>{/if}
					{#if course.requires_id_verification}
					    <li>Valid identification required</li>
					{/if}
					{#if course.min_age == null && !course.requires_id_verification}<li>Requirements for this programme are available from ProSiya during enrolment.</li>{/if}
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
        title="Application submitted"
        on:close={() => window.location.href = '/student/dashboard'}
    >
        <div class="success-message">
            <div class="success-icon">✅</div>
            <p>Your application for <strong>{course?.title}</strong> has been sent.</p>
            <p>
                Signing in does not unlock lessons. Pay, send proof of payment, and wait for an admin
                to authorise this course.
            </p>
            <PaymentInstructions variant="compact" showHeading={false} />
        </div>
        <div slot="footer">
            <Button on:click={() => window.location.href = '/student/dashboard'} variant="accent">View application status</Button>
            <Button on:click={() => window.location.href = '/courses'} variant="outline">Browse programmes</Button>
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

	.payment-note {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: #f8fafc;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.payment-note-title {
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		text-transform: uppercase;
		letter-spacing: 0.04em;
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

	.empty-copy { color: var(--color-text-secondary); line-height: 1.7; }
	
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
