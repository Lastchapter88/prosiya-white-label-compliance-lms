<script lang="ts">
	import { Badge, Button, PaymentInstructions, ProgressRing } from '$lib/components';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { enrollmentService, type LearnerCourse } from '$lib/services/enrollments';
	import { materialSubtitle, studyMaterialService, type StudyMaterial } from '$lib/services/studyMaterial';
	import { accessStatusLabel, hasCourseAccess } from '$lib/utils/courseAccess';

	let course: LearnerCourse | null = null;
	let tab: 'lessons' | 'about' = 'lessons';
	let isLoading = true;
	let error: string | null = null;
	let downloadingId: string | null = null;

	$: slug = $page.params.slug;
	$: unlocked = hasCourseAccess($auth.user, course?.accessStatus);
	$: nextMaterial = unlocked ? course?.materials[0] || null : null;

	$: if (slug && $auth.user?.id) {
		loadCourse();
	}

	async function loadCourse() {
		if (!$auth.user?.id || !slug) return;
		isLoading = true;
		error = null;
		try {
			const courses = await enrollmentService.getMyCourses(
				$auth.user.id,
				$auth.user.paymentStatus === 'paid'
			);
			course = courses.find((item) => item.courseSlug === slug) || null;
			if (!course) {
				error = 'This course is not in your portal yet. Enrol first, then come back here to study.';
			}
		} catch (e: any) {
			error = e.message || 'Could not load this course';
		} finally {
			isLoading = false;
		}
	}

	async function openMaterial(material: StudyMaterial) {
		if (!unlocked) return;
		downloadingId = material.id;
		try {
			const url = await studyMaterialService.getDownloadUrl(material.storagePath);
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch (e: any) {
			alert(e.message || 'Could not open this study file yet');
		} finally {
			downloadingId = null;
		}
	}
</script>

<svelte:head>
	<title>{course?.courseTitle || 'Course'} - ProSiya Academy</title>
</svelte:head>

{#if isLoading}
	<div class="panel muted">Opening your course…</div>
{:else if error || !course}
	<div class="panel empty">
		<a class="back" href="/student/courses">← My courses</a>
		<h1>Course not available</h1>
		<p>{error}</p>
		<Button href="/courses" variant="accent">Browse courses</Button>
	</div>
{:else}
	<a class="back" href="/student/courses">← My courses</a>

	<header class="course-head">
		<img src={course.image} alt="" />
		<div>
			<div class="title-row">
				<div>
					<Badge variant="accent" size="sm">{course.category}</Badge>
					<h1>{course.courseTitle}</h1>
					<p>
						{unlocked
							? `${course.materials.length} study file${course.materials.length === 1 ? '' : 's'} in this pack`
							: accessStatusLabel(course.accessStatus)}
					</p>
				</div>
				<ProgressRing value={course.progress} size={64} stroke={6} />
			</div>
		</div>
	</header>

	<div class="tabs" role="tablist">
		<button type="button" class:active={tab === 'lessons'} on:click={() => (tab = 'lessons')}>
			Lessons
		</button>
		<button type="button" class:active={tab === 'about'} on:click={() => (tab = 'about')}>About</button>
	</div>

	{#if tab === 'lessons'}
		{#if !unlocked}
			<div class="panel muted">
				<p>
					This course is locked. Signing in is not enough. After you pay and send proof, an admin
					must authorise this programme before lessons open.
				</p>
			</div>
		{:else if course.materials.length === 0}
			<div class="panel muted">Study files for this course have not been published yet.</div>
		{:else}
			<ol class="lessons">
				{#each course.materials as material, index}
					<li class:locked={!unlocked}>
						<div class="index" class:done={unlocked}>{unlocked ? '✓' : String(index + 1).padStart(2, '0')}</div>
						<div class="lesson-copy">
							<strong>{material.title}</strong>
							<span>{materialSubtitle(material)}</span>
						</div>
						{#if unlocked}
							<Button
								variant={index === 0 ? 'accent' : 'outline'}
								size="sm"
								disabled={downloadingId === material.id}
								on:click={() => openMaterial(material)}
							>
								{downloadingId === material.id ? 'Opening…' : 'Open'}
							</Button>
						{:else}
							<span class="lock">Locked</span>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	{:else}
		<div class="panel about">
			<p>{course.shortDescription}</p>
			<p>
				Work through each file in order. Firearm courses include legal test knowledge plus the weapon pack.
			</p>
		</div>
	{/if}

	{#if !unlocked}
		<div class="lock-note">
			<p>
				{course.accessStatus === 'denied'
					? 'This application was declined. You can apply again from the course page after speaking with ProSiya.'
					: 'Payment and admin approval unlock this pack. Send proof of payment and wait for authorisation.'}
			</p>
			<PaymentInstructions variant="compact" />
		</div>
	{/if}

	{#if nextMaterial}
		<div class="resume">
			{#if unlocked}
				<Button
					variant="accent"
					className="resume-btn"
					disabled={downloadingId === nextMaterial.id}
					on:click={() => openMaterial(nextMaterial)}
				>
					{downloadingId === nextMaterial.id ? 'Opening…' : `Resume · ${nextMaterial.title}`}
				</Button>
			{:else}
				<Button href="/student/study-material" variant="accent" className="resume-btn">
					See payment steps
				</Button>
			{/if}
		</div>
	{/if}
{/if}

<style>
	.back {
		display: inline-block;
		margin-bottom: 0.85rem;
		color: var(--color-text-secondary);
		font-weight: 700;
		text-decoration: none;
	}

	.course-head {
		display: grid;
		grid-template-columns: 88px 1fr;
		gap: 0.9rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.course-head img {
		width: 88px;
		height: 88px;
		object-fit: cover;
		border-radius: 1.2rem;
	}

	.title-row {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	h1 {
		margin: 0.35rem 0 0.2rem;
		color: var(--color-navy-dark);
		font-size: 1.4rem;
		line-height: 1.2;
	}

	.course-head p {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.tabs {
		display: flex;
		gap: 0.35rem;
		background: var(--color-surface);
		padding: 0.3rem;
		border-radius: 999px;
		margin-bottom: 1rem;
		box-shadow: var(--shadow-sm);
		width: fit-content;
	}

	.tabs button {
		border: none;
		background: transparent;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		font-weight: 700;
		color: var(--color-text-secondary);
		cursor: pointer;
	}

	.tabs button.active {
		background: var(--color-navy-dark);
		color: white;
	}

	.lessons {
		list-style: none;
		padding: 0;
		margin: 0 0 6rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.lessons li,
	.panel,
	.lock-note {
		background: var(--color-surface);
		border-radius: 1.1rem;
		box-shadow: var(--shadow-card);
	}

	.lessons li {
		display: grid;
		grid-template-columns: 40px 1fr auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.85rem 0.9rem;
		border: 1px solid transparent;
	}

	.lessons li:not(.locked):first-child {
		border-color: var(--color-accent);
	}

	.index {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--color-bg-light);
		color: var(--color-navy-dark);
		font-weight: 800;
		font-size: 0.8rem;
	}

	.index.done {
		background: color-mix(in srgb, var(--color-success) 18%, var(--color-surface));
		color: var(--color-success);
	}

	.lesson-copy strong {
		display: block;
		color: var(--color-navy-dark);
	}

	.lesson-copy span,
	.lock {
		color: var(--color-text-secondary);
		font-size: 0.82rem;
	}

	.lock {
		font-weight: 700;
	}

	.panel,
	.lock-note {
		padding: 1.15rem;
	}

	.muted,
	.empty p,
	.about p {
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	.empty {
		text-align: center;
	}

	.resume {
		position: sticky;
		bottom: calc(5.4rem + env(safe-area-inset-bottom));
		padding-top: 0.5rem;
	}

	.resume :global(.resume-btn) {
		width: 100%;
		border-radius: 999px;
		padding: 0.9rem 1rem;
	}

	@media (min-width: 960px) {
		.lessons {
			margin-bottom: 1.5rem;
		}

		.resume {
			position: static;
			max-width: 420px;
		}

		.course-head {
			grid-template-columns: 112px 1fr;
		}

		.course-head img {
			width: 112px;
			height: 112px;
		}
	}
</style>
