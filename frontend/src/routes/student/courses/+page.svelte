<script lang="ts">
	import { Badge, Button, ProgressRing } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { enrollmentService, type LearnerCourse } from '$lib/services/enrollments';
	import { accessStatusLabel, hasCourseAccess } from '$lib/utils/courseAccess';

	let courses: LearnerCourse[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			if ($auth.user?.id) {
				courses = await enrollmentService.getMyCourses(
					$auth.user.id,
					$auth.user.paymentStatus === 'paid'
				);
			}
		} catch (e: any) {
			error = e.message || 'Could not load your courses';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>My courses - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Learner portal</p>
	<h1>My courses</h1>
	<p>Applications stay here. Course files open only after an admin authorises that programme.</p>
</div>

{#if isLoading}
	<div class="panel muted">Loading courses…</div>
{:else if error}
	<div class="panel error">{error}</div>
{:else if courses.length === 0}
	<div class="panel empty">
		<h2>No applications yet</h2>
		<p>Apply for a programme. You will not get course access until ProSiya approves it.</p>
		<Button href="/courses" variant="accent">Browse courses</Button>
	</div>
{:else}
	<div class="list">
		{#each courses as course}
			<a class="course" class:locked={!hasCourseAccess($auth.user, course.accessStatus)} href="/student/courses/{course.courseSlug}">
				<img src={course.image} alt="" />
				<div class="copy">
					<Badge variant={hasCourseAccess($auth.user, course.accessStatus) ? 'success' : 'warning'} size="sm">
						{hasCourseAccess($auth.user, course.accessStatus) ? 'Unlocked' : accessStatusLabel(course.accessStatus)}
					</Badge>
					<h2>{course.courseTitle}</h2>
					<p>{course.shortDescription}</p>
					<p class="meta">
						{#if hasCourseAccess($auth.user, course.accessStatus)}
							{course.materials.length} study file{course.materials.length === 1 ? '' : 's'}
						{:else}
							Locked until an admin authorises this course.
						{/if}
					</p>
				</div>
				{#if hasCourseAccess($auth.user, course.accessStatus)}
					<ProgressRing value={course.progress} size={58} stroke={6} />
				{/if}
			</a>
		{/each}
	</div>
{/if}

<style>
	.page-head {
		margin-bottom: 1.25rem;
	}

	.kicker {
		margin: 0 0 0.3rem;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0 0 0.35rem;
		color: var(--color-navy-dark);
		font-size: 1.7rem;
	}

	.page-head p:last-child {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.course,
	.panel {
		background: var(--color-surface);
		border-radius: 1.15rem;
		box-shadow: var(--shadow-card);
	}

	.course {
		display: grid;
		grid-template-columns: 76px 1fr auto;
		gap: 0.85rem;
		align-items: center;
		padding: 0.9rem;
		text-decoration: none;
		color: inherit;
	}

	.course.locked {
		opacity: 0.92;
	}

	.course img {
		width: 76px;
		height: 76px;
		object-fit: cover;
		border-radius: 1rem;
	}

	.copy h2 {
		margin: 0.35rem 0 0.2rem;
		font-size: 1.05rem;
		color: var(--color-navy-dark);
	}

	.copy p {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 0.86rem;
	}

	.meta {
		margin-top: 0.35rem !important;
		font-weight: 600;
	}

	.panel {
		padding: 1.5rem;
		text-align: center;
	}

	.empty h2 {
		margin: 0 0 0.5rem;
		color: var(--color-navy-dark);
	}

	.muted,
	.empty p {
		color: var(--color-text-secondary);
	}

	.error {
		color: var(--color-error);
	}

	@media (max-width: 640px) {
		.course {
			grid-template-columns: 64px 1fr;
		}

		.course :global(.ring) {
			display: none;
		}
	}
</style>
