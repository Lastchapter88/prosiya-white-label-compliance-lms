<script lang="ts">
	import { Badge, Button, PaymentInstructions, ProgressRing } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth, hasPaidAccess } from '$lib/stores/auth';
	import { enrollmentService, type LearnerCourse } from '$lib/services/enrollments';

	let courses: LearnerCourse[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: paid = hasPaidAccess($auth.user);
	$: studyCount = courses.reduce((sum, course) => sum + course.materials.length, 0);
	$: nextCourse = courses[0] || null;
	$: firearmCourse = courses.find((course) => course.category === 'Firearm') || nextCourse;

	onMount(async () => {
		try {
			if ($auth.user?.id) {
				courses = await enrollmentService.getMyCourses($auth.user.id);
			}
		} catch (e: any) {
			error = e.message || 'Could not load your study portal';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Study portal - ProSiya Academy</title>
</svelte:head>

{#if isLoading}
	<div class="panel muted">Loading your courses…</div>
{:else if error}
	<div class="panel error">{error}</div>
{:else}
	{#if nextCourse}
		<section class="hero">
			<p class="live-label">{paid ? 'Study pack ready' : 'Enrolled · payment pending'}</p>
			<h2>{nextCourse.courseTitle}</h2>
			<p class="hero-meta">
				{nextCourse.category}
				· {nextCourse.materials.length || 0} study
				{nextCourse.materials.length === 1 ? 'file' : 'files'}
			</p>
			<div class="hero-actions">
				<Button href="/student/courses/{nextCourse.courseSlug}" variant="accent">
					{paid ? 'Continue studying' : 'Open course'}
				</Button>
				<Button href="/student/study-material" variant="outline" className="hero-outline">
					Study packs
				</Button>
			</div>
		</section>
	{:else}
		<section class="hero">
			<p class="live-label">Start here</p>
			<h2>Enrol to unlock your study portal</h2>
			<p class="hero-meta">Your courses, PDFs and legal test packs will appear here after enrolment.</p>
			<div class="hero-actions">
				<Button href="/courses" variant="accent">Browse courses</Button>
			</div>
		</section>
	{/if}

	<div class="stats">
		<article class="stat">
			<div class="stat-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h7v14H4V5Zm9 0h7v14h-7V5Z" /></svg>
			</div>
			<strong>{courses.length}</strong>
			<span>Courses</span>
		</article>
		<article class="stat">
			<div class="stat-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h9l5 5v15H6V2Zm8 1.5V8h4.5L14 3.5Z" /></svg>
			</div>
			<strong>{studyCount}</strong>
			<span>Study files</span>
		</article>
		<article class="stat">
			<div class="stat-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 9 8H3l5 4-2 8 6-4 6 4-2-8 5-4h-6l-3-6Z" /></svg>
			</div>
			<strong>0</strong>
			<span>Certificates</span>
		</article>
	</div>

	{#if !paid}
		<section class="insight">
			<div>
				<strong>Unlock your study packs</strong>
				<p>
					Payment confirmation opens your PDFs, including legal test knowledge for firearm courses.
				</p>
			</div>
			<Button href="/student/study-material" variant="navy" size="sm">Payment steps</Button>
		</section>
	{:else if firearmCourse}
		<section class="insight">
			<div>
				<strong>Study tip</strong>
				<p>
					Start with legal test knowledge, then the weapon-specific pack for {firearmCourse.courseTitle}.
				</p>
			</div>
			<Button href="/student/courses/{firearmCourse.courseSlug}" variant="navy" size="sm">
				Open pack
			</Button>
		</section>
	{/if}

	<section class="continue">
		<div class="section-head">
			<h3>Continue learning</h3>
			<a href="/student/courses">All courses</a>
		</div>

		{#if courses.length === 0}
			<div class="panel muted">
				<p>No enrolled courses yet.</p>
				<Button href="/courses" variant="accent">Browse catalogue</Button>
			</div>
		{:else}
			<div class="course-row">
				{#each courses as course}
					<a class="course-card" href="/student/courses/{course.courseSlug}">
						<div class="course-card-top">
							<img src={course.image} alt="" />
							<ProgressRing value={course.progress} size={52} stroke={5} />
						</div>
						<Badge variant="accent" size="sm">{course.category}</Badge>
						<h4>{course.courseTitle}</h4>
						<p>
							{course.materials.length} file{course.materials.length === 1 ? '' : 's'}
							· {course.progress || 0}% complete
						</p>
						<div class="bar"><span style="width: {course.progress || 4}%"></span></div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	{#if !paid && courses.length}
		<section class="pay-note">
			<PaymentInstructions variant="compact" />
		</section>
	{/if}
{/if}

<style>
	.hero {
		background: linear-gradient(145deg, #1a2332 0%, #2d3748 58%, #3f5368 100%);
		color: white;
		border-radius: 1.35rem;
		padding: 1.35rem 1.25rem 1.4rem;
		box-shadow: var(--shadow-lg);
	}

	.live-label {
		margin: 0 0 0.55rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.hero h2 {
		margin: 0 0 0.4rem;
		font-size: 1.45rem;
		line-height: 1.2;
	}

	.hero-meta {
		margin: 0 0 1.1rem;
		opacity: 0.85;
		font-size: 0.92rem;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.hero-actions :global(.hero-outline) {
		border-color: rgba(255, 255, 255, 0.45);
		color: white;
		background: transparent;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.7rem;
		margin: 1rem 0;
	}

	.stat,
	.panel,
	.insight,
	.course-card,
	.pay-note {
		background: var(--color-surface);
		border-radius: 1.1rem;
		box-shadow: var(--shadow-card);
	}

	.stat {
		padding: 0.9rem 0.7rem;
		text-align: center;
	}

	.stat-icon {
		width: 32px;
		height: 32px;
		margin: 0 auto 0.4rem;
		color: var(--color-accent);
	}

	.stat-icon svg {
		width: 28px;
		height: 28px;
	}

	.stat strong {
		display: block;
		font-size: 1.35rem;
		color: var(--color-navy-dark);
	}

	.stat span {
		color: var(--color-text-secondary);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.insight {
		padding: 1rem 1.1rem;
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
		background: color-mix(in srgb, var(--color-success) 12%, var(--color-surface));
		margin-bottom: 1.25rem;
	}

	.insight strong {
		display: block;
		color: var(--color-navy-dark);
		margin-bottom: 0.25rem;
	}

	.insight p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.85rem;
	}

	.section-head h3 {
		margin: 0;
		color: var(--color-navy-dark);
		font-size: 1.1rem;
	}

	.section-head a {
		color: var(--color-navy-light);
		font-weight: 700;
		font-size: 0.88rem;
		text-decoration: none;
	}

	.course-row {
		display: grid;
		grid-template-columns: minmax(240px, 1fr);
		gap: 0.85rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
	}

	.course-card {
		display: block;
		padding: 0.9rem;
		text-decoration: none;
		color: inherit;
		min-width: 240px;
	}

	.course-card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
		margin-bottom: 0.7rem;
	}

	.course-card img {
		width: 72px;
		height: 72px;
		object-fit: cover;
		border-radius: 1rem;
	}

	.course-card h4 {
		margin: 0.45rem 0 0.25rem;
		color: var(--color-navy-dark);
		font-size: 1.02rem;
	}

	.course-card p {
		margin: 0 0 0.7rem;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
	}

	.bar {
		height: 8px;
		background: var(--color-bg-light);
		border-radius: 99px;
		overflow: hidden;
	}

	.bar span {
		display: block;
		height: 100%;
		background: var(--color-accent);
		border-radius: 99px;
		min-width: 8px;
	}

	.panel {
		padding: 1.25rem;
		text-align: center;
	}

	.muted {
		color: var(--color-text-secondary);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.error {
		color: var(--color-error);
	}

	.pay-note {
		margin-top: 1.25rem;
		padding: 1rem;
	}

	@media (min-width: 720px) {
		.hero {
			padding: 1.7rem 1.6rem;
		}

		.hero h2 {
			font-size: 1.8rem;
			max-width: 18ch;
		}

		.course-row {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		}

		.insight {
			padding: 1.15rem 1.3rem;
		}
	}
</style>
