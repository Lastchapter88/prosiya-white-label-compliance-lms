<script lang="ts">
	import { Sidebar, Badge, Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { courseService } from '$lib/services/courses';
	import { fade } from 'svelte/transition';
	
	let enrolledCourses: any[] = [];
	let isLoading = true;
	let error: string | null = null;
    
    // Derived stats (mocked for now until backend provides full reporting)
	let stats = {
		coursesEnrolled: 0,
		coursesCompleted: 0,
		certificatesEarned: 0,
		hoursLearned: 0
	};

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			window.location.href = '/login';
			return;
		}

		try {
			const data = await courseService.getMyEnrollments();
            // Handle pagination if necessary
            enrolledCourses = data.results || data;
            
            stats.coursesEnrolled = enrolledCourses.length;
            stats.coursesCompleted = enrolledCourses.filter(e => e.status === 'completed').length;
            // More complex stats would come from a dedicated stats endpoint
		} catch (e: any) {
			error = e.message || "Failed to load dashboard data";
		} finally {
			isLoading = false;
		}
	});

    // Mock upcoming live classes - keep for visual premium feel as per docs
	const upcomingClasses = [
		{
			id: 1,
			title: 'Firearm Handling Basics',
			instructor: 'Mike Johnson',
			date: '2026-02-15',
			time: '14:00',
			duration: '2 hours',
			isLive: false
		},
		{
			id: 2,
			title: 'Pertaining Firearms',
			instructor: 'Sarah Williams',
			date: 'Tomorrow',
			time: '10:00',
			duration: '1.5 hours',
			isLive: true
		}
	];
</script>

<svelte:head>
	<title>Student Dashboard - ProSiya LMS</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar 
		userRole={$auth.user?.role as 'student' | 'instructor' | 'admin' || 'student'}
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>
	
	<main class="dashboard-main">
		<div class="dashboard-header">
			<div>
				<h1>Welcome back, {$auth.user?.first_name || 'Student'}! 👋</h1>
				<p class="subtitle">Continue your learning journey</p>
			</div>
		</div>
		
		<!-- Stats Cards -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon">📚</div>
				<div class="stat-content">
					<h3>{stats.coursesEnrolled}</h3>
					<p>Courses Enrolled</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">✅</div>
				<div class="stat-content">
					<h3>{stats.coursesCompleted}</h3>
					<p>Courses Completed</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🎓</div>
				<div class="stat-content">
					<h3>{stats.certificatesEarned}</h3>
					<p>Certificates Earned</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">⏱️</div>
				<div class="stat-content">
					<h3>{stats.hoursLearned}</h3>
					<p>Hours Learned</p>
				</div>
			</div>
		</div>
		
		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Loading your dashboard...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<p>Error: {error}</p>
				<Button variant="outline" on:click={() => window.location.reload()}>Retry</Button>
			</div>
		{:else}
			<!-- My Courses Section -->
			<section class="section" in:fade>
				<div class="section-header">
					<h2>My Courses</h2>
					<a href="/student/courses" class="view-all">View All →</a>
				</div>
				
				{#if enrolledCourses.length === 0}
					<div class="empty-state">
						<p>You haven't enrolled in any courses yet.</p>
						<Button href="/courses" variant="accent">Browse Courses</Button>
					</div>
				{:else}
					<div class="courses-grid">
						{#each enrolledCourses as enrollment}
							<div class="course-enrollment-card">
								<img src={enrollment.course_details.cover_image || '/images/courses/security-training.png'} alt={enrollment.course_details.title} class="course-image" />
								
								<div class="course-info">
									<Badge variant="accent" size="sm" className="mb-2">{enrollment.course_details.category}</Badge>
									<h3>{enrollment.course_details.title}</h3>
									
									<div class="progress-section">
										<div class="progress-header">
											<span class="progress-label">Progress</span>
											<span class="progress-percent">{enrollment.progress_percentage}%</span>
										</div>
										<div class="progress-bar">
											<div class="progress-fill" style="width: {enrollment.progress_percentage}%"></div>
										</div>
									</div>
									
									<div class="course-footer">
										<Button href="/student/courses/{enrollment.course}" variant="navy" size="sm" className="w-full">
											{enrollment.progress_percentage > 0 ? 'Continue' : 'Start'} Course
										</Button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Upcoming Live Classes -->
			<section class="section" in:fade>
				<div class="section-header">
					<h2>Upcoming Live Classes</h2>
					<a href="/student/live" class="view-all">View All →</a>
				</div>
				
				<div class="live-classes-list">
					{#each upcomingClasses as liveClass}
						<div class="live-class-card">
							{#if liveClass.isLive}
								<Badge variant="live">LIVE NOW</Badge>
							{/if}
							
							<div class="live-class-info">
								<h3>{liveClass.title}</h3>
								<p class="instructor">👨‍🏫 {liveClass.instructor}</p>
								<div class="live-class-meta">
									<span>📅 {liveClass.date}</span>
									<span>🕐 {liveClass.time}</span>
									<span>⏱️ {liveClass.duration}</span>
								</div>
							</div>
							
							<div class="live-class-actions">
								{#if liveClass.isLive}
									<Button variant="accent">Join Now</Button>
								{:else}
									<Button variant="outline">Set Reminder</Button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>
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
	
	.dashboard-header {
		margin-bottom: 2rem;
	}
	
	.dashboard-header h1 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}
	
	.subtitle {
		color: var(--color-text-secondary);
		font-size: 1.125rem;
		margin: 0;
	}
	
	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}
	
	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: all 0.3s ease;
	}
	
	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-card-hover);
	}
	
	.stat-icon {
		font-size: 2.5rem;
	}
	
	.stat-content h3 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin: 0;
	}
	
	.stat-content p {
		color: var(--color-text-secondary);
		margin: 0;
		font-size: 0.875rem;
	}
	
	.section {
		margin-bottom: 3rem;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	
	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin: 0;
	}
	
	.view-all {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
		transition: color 0.2s ease;
	}
	
	.view-all:hover {
		color: var(--color-accent-dark);
	}
	
	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 2rem;
	}
	
	.course-enrollment-card {
		background: white;
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-card);
		display: flex;
		flex-direction: column;
	}
	
	.course-image {
		width: 100%;
		height: 160px;
		object-fit: cover;
	}
	
	.course-info {
		padding: 1.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	
	.course-info h3 {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 1rem;
	}
	
	.progress-section {
		margin-bottom: 1.5rem;
	}
	
	.progress-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	
	.progress-label {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 600;
	}
	
	.progress-percent {
		font-size: 0.875rem;
		color: var(--color-accent);
		font-weight: 700;
	}
	
	.progress-bar {
		height: 8px;
		background: var(--color-bg-light);
		border-radius: var(--radius-full);
		overflow: hidden;
	}
	
	.progress-fill {
		height: 100%;
		background: var(--color-accent);
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}
    
    .course-footer {
        margin-top: auto;
    }

	.live-classes-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.live-class-card {
		background: white;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		display: flex;
		align-items: center;
		gap: 1.5rem;
		position: relative;
	}
	
	.live-class-info {
		flex: 1;
	}
	
	.live-class-info h3 {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin: 0.5rem 0;
	}
	
	.live-class-meta {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}
	
	.loading-container, .error-container, .empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem;
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		text-align: center;
		gap: 1rem;
	}

	.loader {
		border: 4px solid var(--color-bg-light);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.dashboard-main { margin-left: 0; }
	}
</style>
