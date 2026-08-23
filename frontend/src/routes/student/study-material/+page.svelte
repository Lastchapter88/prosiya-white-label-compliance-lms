<script lang="ts">
	import { Sidebar, Badge, Button, PaymentInstructions } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth, hasPaidAccess } from '$lib/stores/auth';
	import { courseCatalogue } from '$lib/data/courses';
	import { studyMaterialService, type StudyMaterial } from '$lib/services/studyMaterial';

	type CourseMaterials = {
		courseSlug: string;
		courseTitle: string;
		materials: StudyMaterial[];
	};

	let rows: CourseMaterials[] = [];
	let isLoading = true;
	let error: string | null = null;
	let downloadingId: string | null = null;

	$: canAccessMaterials = hasPaidAccess($auth.user);

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			window.location.href = '/login?redirect=/student/study-material';
			return;
		}
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		error = null;
		try {
			const allMaterials = await studyMaterialService.getAllMaterials();
			const courseSlugs = [...new Set(allMaterials.map((m) => m.courseSlug))];
			rows = courseSlugs.map((courseSlug) => {
				const course = courseCatalogue.find((c) => c.slug === courseSlug);
				return {
					courseSlug,
					courseTitle: course?.title || courseSlug,
					materials: allMaterials.filter((m) => m.courseSlug === courseSlug)
				};
			});
		} catch (e: any) {
			error = e.message || 'Failed to load study materials';
		} finally {
			isLoading = false;
		}
	}

	async function downloadMaterial(material: StudyMaterial) {
		if (!canAccessMaterials) return;

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
	<title>Study Material - ProSiya LMS</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar
		userRole={($auth.user?.role as 'student' | 'instructor' | 'admin') || 'student'}
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>

	<main class="dashboard-main">
		<div class="dashboard-header">
			<h1>Study Material</h1>
			<p class="subtitle">Official PDF study guides for your enrolled courses.</p>
		</div>

		{#if isLoading}
			<div class="panel loading">Loading study materials…</div>
		{:else if error}
			<div class="panel error">{error}</div>
		{:else if !canAccessMaterials}
			<div class="panel payment-notice">
				<div class="notice-icon" aria-hidden="true">🔒</div>
				<h2>Payment required to access study materials</h2>
				<p>
					Study materials are available to enrolled learners who have completed their course
					payment. Once your payment has been confirmed by ProSiya Academy, your account will be
					unlocked and you will be able to download your materials here.
				</p>

				<div class="payment-section">
					<PaymentInstructions />
				</div>

				<div class="notice-actions">
					<Button href="/courses" variant="navy">View Courses &amp; Fees</Button>
				</div>
			</div>
		{:else if rows.length === 0}
			<div class="panel empty">
				<p>No study materials have been published yet.</p>
				<Button href="/courses" variant="accent">Browse Courses</Button>
			</div>
		{:else}
			<div class="access-banner">
				<Badge variant="success">Payment confirmed — full access enabled</Badge>
			</div>

			<div class="course-list">
				{#each rows as row}
					<section class="panel course-panel">
						<div class="course-header">
							<div>
								<h2>{row.courseTitle}</h2>
								<p>{row.materials.length} document{row.materials.length === 1 ? '' : 's'}</p>
							</div>
						</div>

						<ul class="material-list">
							{#each row.materials as material}
								<li>
									<div>
										<strong>{material.title}</strong>
										<span>Grade {material.grade} · {material.fileName}</span>
									</div>
									<Button
										variant="accent"
										size="sm"
										disabled={downloadingId === material.id}
										on:click={() => downloadMaterial(material)}
									>
										{downloadingId === material.id ? 'Opening…' : 'Download PDF'}
									</Button>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		{/if}
	</main>
</div>

<style>
	.dashboard-layout {
		display: flex;
		min-height: 100vh;
		background: var(--color-bg-light);
	}
	.dashboard-main {
		margin-left: 280px;
		flex: 1;
		padding: 2rem;
	}
	.dashboard-header h1 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}
	.subtitle {
		color: var(--color-text-secondary);
		margin: 0 0 2rem;
	}
	.panel {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 1.5rem;
	}
	.loading,
	.error,
	.empty {
		text-align: center;
	}
	.error {
		color: var(--color-error);
	}
	.payment-notice {
		max-width: 720px;
		text-align: center;
		padding: 2.5rem 2rem;
	}
	.notice-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	.payment-notice h2 {
		margin: 0 0 1rem;
		color: var(--color-navy-dark);
		font-size: 1.35rem;
	}
	.payment-notice p {
		margin: 0 0 1rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	.payment-section {
		margin: 1.5rem 0;
		padding: 1.25rem;
		background: #f8fafc;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		text-align: left;
	}
	.notice-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 1.5rem;
	}
	.access-banner {
		margin-bottom: 1.25rem;
	}
	.course-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.course-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.course-header h2 {
		margin: 0 0 0.25rem;
		color: var(--color-navy-dark);
	}
	.course-header p {
		margin: 0;
		color: var(--color-text-secondary);
	}
	.material-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.material-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}
	.material-list span {
		display: block;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
	@media (max-width: 1024px) {
		.dashboard-main {
			margin-left: 0;
		}
	}
</style>
