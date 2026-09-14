<script lang="ts">
	import { Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { enrollmentService, type LearnerCourse } from '$lib/services/enrollments';
	import { hasCourseAccess } from '$lib/utils/courseAccess';

	let courses: LearnerCourse[] = [];
	let isLoading = true;
	$: unlocked = courses.filter((course) => hasCourseAccess($auth.user, course.accessStatus));

	onMount(async () => {
		try {
			if ($auth.user?.id) {
				courses = await enrollmentService.getMyCourses(
					$auth.user.id,
					$auth.user.paymentStatus === 'paid'
				);
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Assessments - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Assessments</p>
	<h1>Tests and legal knowledge</h1>
	<p>Tests open only for courses an admin has authorised.</p>
</div>

{#if isLoading}
	<div class="panel muted">Loading assessments…</div>
{:else if unlocked.length === 0}
	<div class="panel empty">
		<p>
			{courses.length
				? 'Your applications are pending. Assessments stay locked until an admin authorises the course.'
				: 'Apply for a course first. Tests appear after ProSiya authorises access.'}
		</p>
		<Button href="/courses" variant="accent">Browse courses</Button>
	</div>
{:else}
	<div class="list">
		{#each unlocked as course}
			<section class="hero">
				<p class="label">Study then test</p>
				<h2>{course.courseTitle}</h2>
				<p>
					{course.category === 'Firearm'
						? 'Includes legal test knowledge plus the firearm pack. Complete the PDFs, then book your assessment with the academy.'
						: 'Work through the grade study files, then attend the academy assessment.'}
				</p>
				<div class="meta">
					<span>{course.materials.length} files</span>
					<span>{course.category}</span>
				</div>
				<Button href="/student/courses/{course.courseSlug}" variant="accent">Open study pack</Button>
			</section>
		{/each}
	</div>
{/if}

<style>
	.page-head {
		margin-bottom: 1.2rem;
	}

	.kicker {
		margin: 0 0 0.3rem;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	h1 {
		margin: 0 0 0.35rem;
		color: var(--color-navy-dark);
		font-size: 1.7rem;
	}

	.page-head p:last-child,
	.muted,
	.empty p {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.hero {
		background: linear-gradient(145deg, #1a2332 0%, #2d3748 100%);
		color: white;
		border-radius: 1.3rem;
		padding: 1.3rem 1.2rem;
	}

	.label {
		margin: 0 0 0.45rem;
		color: var(--color-accent);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero h2 {
		margin: 0 0 0.45rem;
		font-size: 1.3rem;
	}

	.hero p {
		margin: 0 0 0.9rem;
		opacity: 0.88;
		line-height: 1.45;
	}

	.meta {
		display: flex;
		gap: 0.6rem;
		margin-bottom: 1rem;
	}

	.meta span {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.panel {
		background: var(--color-surface);
		border-radius: 1.15rem;
		box-shadow: var(--shadow-card);
		padding: 1.4rem;
		text-align: center;
	}
</style>
