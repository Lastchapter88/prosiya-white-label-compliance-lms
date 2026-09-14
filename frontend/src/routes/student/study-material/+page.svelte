<script lang="ts">
	import { Badge, Button, PaymentInstructions } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { enrollmentService, type LearnerCourse } from '$lib/services/enrollments';
	import { materialSubtitle, studyMaterialService, type StudyMaterial } from '$lib/services/studyMaterial';
	import { hasCourseAccess } from '$lib/utils/courseAccess';

	let courses: LearnerCourse[] = [];
	let isLoading = true;
	let error: string | null = null;
	let downloadingId: string | null = null;

	$: unlockedCourses = courses.filter((course) => hasCourseAccess($auth.user, course.accessStatus));

	onMount(async () => {
		try {
			if ($auth.user?.id) {
				courses = await enrollmentService.getMyCourses(
					$auth.user.id,
					$auth.user.paymentStatus === 'paid'
				);
			}
		} catch (e: any) {
			error = e.message || 'Failed to load study materials';
		} finally {
			isLoading = false;
		}
	});

	async function downloadMaterial(material: StudyMaterial) {
		const course = courses.find((item) => item.courseSlug === material.courseSlug);
		if (!hasCourseAccess($auth.user, course?.accessStatus)) return;
		downloadingId = material.id;
		try {
			const url = await studyMaterialService.getDownloadUrl(material.storagePath);
			window.open(url, '_blank', 'noopener,noreferrer');
		} catch (e: any) {
			alert(e.message || 'Could not download file');
		} finally {
			downloadingId = null;
		}
	}
</script>

<svelte:head>
	<title>Study packs - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Study packs</p>
	<h1>Your materials</h1>
	<p>Official PDFs only appear for courses an admin has authorised.</p>
</div>

{#if isLoading}
	<div class="panel muted">Loading study packs…</div>
{:else if error}
	<div class="panel error">{error}</div>
{:else if unlockedCourses.length === 0}
	<div class="panel payment">
		<div class="lock" aria-hidden="true">🔒</div>
		<h2>No authorised study packs yet</h2>
		<p>
			Signing in does not open PDFs. Apply for a course, pay, and wait for an admin to authorise that programme.
		</p>
		<div class="pay-box">
			<PaymentInstructions />
		</div>
		<div class="actions">
			<Button href="/courses" variant="navy">Apply for a course</Button>
			<Button href="/student/courses" variant="outline">My applications</Button>
		</div>
	</div>
{:else}
	<Badge variant="success">
		{unlockedCourses.length} authorised pack{unlockedCourses.length === 1 ? '' : 's'}
	</Badge>
	<div class="packs">
		{#each unlockedCourses as course}
			<section class="panel pack">
				<div class="pack-head">
					<img src={course.image} alt="" />
					<div>
						<h2>{course.courseTitle}</h2>
						<p>{course.materials.length} document{course.materials.length === 1 ? '' : 's'}</p>
					</div>
					<Button href="/student/courses/{course.courseSlug}" variant="outline" size="sm">Open</Button>
				</div>
				{#if course.materials.length === 0}
					<p class="empty-copy">No files published for this course yet.</p>
				{:else}
					<ul>
						{#each course.materials as material}
							<li>
								<div>
									<strong>{material.title}</strong>
									<span>{materialSubtitle(material)}</span>
								</div>
								<Button
									variant="accent"
									size="sm"
									disabled={downloadingId === material.id}
									on:click={() => downloadMaterial(material)}
								>
									{downloadingId === material.id ? 'Opening…' : 'Download'}
								</Button>
							</li>
						{/each}
					</ul>
				{/if}
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

	.page-head > p:last-child {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.packs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.panel {
		background: var(--color-surface);
		border-radius: 1.15rem;
		box-shadow: var(--shadow-card);
		padding: 1.15rem;
	}

	.pack-head {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 0.85rem;
	}

	.pack-head img {
		width: 56px;
		height: 56px;
		object-fit: cover;
		border-radius: 0.85rem;
	}

	.pack-head h2 {
		margin: 0;
		font-size: 1.05rem;
		color: var(--color-navy-dark);
	}

	.pack-head p,
	.empty-copy,
	.muted,
	.payment p {
		margin: 0;
		color: var(--color-text-secondary);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	li {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
		padding: 0.8rem;
		border: 1px solid var(--color-border);
		border-radius: 0.9rem;
	}

	li span {
		display: block;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
		margin-top: 0.2rem;
	}

	.payment {
		text-align: center;
		max-width: 640px;
	}

	.lock {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.payment h2 {
		margin: 0 0 0.5rem;
		color: var(--color-navy-dark);
	}

	.pay-box {
		margin: 1rem 0;
		text-align: left;
		background: var(--color-bg-light);
		border-radius: 0.9rem;
		padding: 1rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		justify-content: center;
	}

	.error {
		color: var(--color-error);
		text-align: center;
	}

	.muted {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	@media (max-width: 640px) {
		.pack-head {
			grid-template-columns: 56px 1fr;
		}

		li {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
