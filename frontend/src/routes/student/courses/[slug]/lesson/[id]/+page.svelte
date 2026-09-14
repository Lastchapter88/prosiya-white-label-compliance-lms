<script lang="ts">
	import { Button, Badge } from '$lib/components';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { courseService } from '$lib/services/courses';
	import { enrollmentService } from '$lib/services/enrollments';
	import { auth } from '$lib/stores/auth';
	import { hasCourseAccess } from '$lib/utils/courseAccess';
	import { fade, slide } from 'svelte/transition';

	let course: any = null;
	let currentLesson: any = null;
	let isLoading = true;
	let isCompleting = false;
	let error: string | null = null;

	$: lessonId = ($page.params as any).id;
	$: slug = ($page.params as any).slug;

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			if ($auth.user?.id) {
				const courses = await enrollmentService.getMyCourses(
					$auth.user.id,
					$auth.user.paymentStatus === 'paid'
				);
				const enrolled = courses.find((item) => item.courseSlug === slug);
				if (!hasCourseAccess($auth.user, enrolled?.accessStatus)) {
					error = 'This lesson is locked until an admin authorises the course.';
					isLoading = false;
					return;
				}
			}
			course = await courseService.getCourse(slug);
			currentLesson = await courseService.getLesson(lessonId);
		} catch (e: any) {
			error = e.message || "Failed to load lesson";
		} finally {
			isLoading = false;
		}
	}

	// Re-load when lesson ID changes
	$: if (lessonId) {
		loadData();
	}

	async function handleComplete() {
		isCompleting = true;
		try {
			await courseService.completeLesson(lessonId);
			// Find next lesson
			const flatLessons = course.modules.flatMap((m: any) => m.lessons);
			const currentIndex = flatLessons.findIndex((l: any) => l.id === lessonId);
			if (currentIndex < flatLessons.length - 1) {
				const nextLesson = flatLessons[currentIndex + 1];
				window.location.href = `/student/courses/${slug}/lesson/${nextLesson.id}`;
			} else {
				alert("Congratulations! You have completed all lessons in this course.");
				window.location.href = `/student/dashboard`;
			}
		} catch (e: any) {
			alert(e.message || "Failed to complete lesson");
		} finally {
			isCompleting = false;
		}
	}
</script>

<svelte:head>
	<title>{currentLesson?.title || 'Lesson'} - ProSiya LMS</title>
</svelte:head>

<div class="player-layout">
	
	<main class="player-container">
		{#if isLoading}
			<div class="loading-overlay">
				<div class="loader"></div>
				<p>Preparing your lesson...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<h2>Error Loading Lesson</h2>
				<p>{error}</p>
				<Button variant="outline" href="/student/dashboard">Back to Dashboard</Button>
			</div>
		{:else if course && currentLesson}
			<div class="sidebar">
				<div class="sidebar-header">
					<h3>{course.title}</h3>
					<div class="progress-info">
						<span>Progress</span>
						<!-- In a real app, enrollment progress would be synced here -->
					</div>
				</div>
				
				<div class="curriculum">
					{#each course.modules as module, mIdx}
						<div class="module-group">
							<div class="module-title">
								Module {mIdx + 1}: {module.title}
							</div>
							<div class="lessons">
								{#each module.lessons as lesson}
									<a 
										href="/student/courses/{slug}/lesson/{lesson.id}" 
										class="lesson-item"
                                        class:active={lesson.id === lessonId}
									>
										<span class="lesson-status-icon">
											{lesson.id === lessonId ? '📖' : '📄'}
										</span>
										<span class="lesson-label">{lesson.title}</span>
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<div class="content-area">
				<div class="lesson-header">
					<div class="lesson-identity">
						<Badge variant="navy" className="mb-2">{currentLesson.lesson_type}</Badge>
						<h1>{currentLesson.title}</h1>
					</div>
					<div class="lesson-actions">
						<Button 
							variant="accent" 
							disabled={isCompleting} 
							on:click={handleComplete}
						>
							{isCompleting ? 'Marking...' : 'Complete & Next'}
						</Button>
					</div>
				</div>
				
				<div class="media-container" in:fade>
					{#if currentLesson.lesson_type === 'video'}
						<div class="video-player">
							{#if currentLesson.video_url}
								<iframe 
									src={currentLesson.video_url} 
									title={currentLesson.title}
									frameborder="0" 
									allow="autoplay; fullscreen; picture-in-picture" 
									allowfullscreen
								></iframe>
							{:else}
								<div class="placeholder-video">
									<div class="icon">🎥</div>
									<p>Video content not available</p>
								</div>
							{/if}
						</div>
					{:else if currentLesson.lesson_type === 'document'}
						<div class="document-viewer">
							{#if currentLesson.content_html}
								<div class="prose">
									{@html currentLesson.content_html}
								</div>
							{:else}
								<div class="placeholder-doc">
									<div class="icon">📄</div>
									<p>Reading material content would appear here.</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
				
				<div class="lesson-footer">
					<div class="description-section">
						<h3>About this lesson</h3>
						<p>{currentLesson.description || "No description provided."}</p>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.player-layout {
		display: flex;
		flex-direction: column;
		min-height: 70vh;
		background: var(--color-bg);
	}

	.player-container {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	/* Sidebar */
	.sidebar {
		width: 320px;
		background: var(--color-bg-light);
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-border);
		background: white;
	}

	.sidebar-header h3 {
		font-size: 1.1rem;
		margin: 0;
		color: var(--color-navy-dark);
	}

	.curriculum {
		flex: 1;
	}

	.module-group {
		margin-bottom: 0.5rem;
	}

	.module-title {
		padding: 0.75rem 1.5rem;
		background: rgba(0,0,0,0.03);
		font-weight: 700;
		font-size: 0.85rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.lessons {
		display: flex;
		flex-direction: column;
	}

	.lesson-item {
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: var(--color-text);
		font-size: 0.95rem;
		transition: all 0.2s ease;
		border-bottom: 1px solid rgba(0,0,0,0.02);
	}

	.lesson-item:hover {
		background: rgba(0,0,0,0.05);
	}

	.lesson-item.active {
		background: white;
		border-left: 4px solid var(--color-accent);
		color: var(--color-navy-dark);
		font-weight: 600;
	}

	.lesson-status-icon {
		font-size: 1.1rem;
	}

	/* Content Area */
	.content-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		background: white;
	}

	.lesson-header {
		padding: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-border);
	}

	.lesson-identity h1 {
		font-size: 1.75rem;
		margin: 0;
		color: var(--color-navy-dark);
	}

	.media-container {
		padding: 2rem;
		flex: 1;
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
	}

	.video-player {
		aspect-ratio: 16 / 9;
		background: black;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-xl);
	}

	.video-player iframe {
		width: 100%;
		height: 100%;
	}

	.placeholder-video, .placeholder-doc {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--color-text-secondary);
	}

	.icon { font-size: 4rem; margin-bottom: 1rem; }

	.document-viewer {
		background: white;
		padding: 2rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		min-height: 400px;
	}

	.prose {
		line-height: 1.8;
		font-size: 1.1rem;
	}

	.lesson-footer {
		padding: 2rem;
		border-top: 1px solid var(--color-border);
		background: var(--color-bg-light);
	}

	.description-section h3 {
		margin-bottom: 1rem;
		color: var(--color-navy-dark);
	}

	/* Loading/Error */
	.loading-overlay, .error-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.sidebar {
			display: none; /* In a real app we'd use a drawer */
		}
	}
</style>
