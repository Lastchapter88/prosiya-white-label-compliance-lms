<script lang="ts">
	import { Sidebar, Badge, Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { courseService } from '$lib/services/courses';
	import { fade } from 'svelte/transition';

	let courses: any[] = [];
	let students: any[] = [];
	let isLoading = true;
	let stats = {
		totalStudents: 0,
		activeCourses: 0,
		pendingReviews: 0,
		upcomingClasses: 0
	};

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			window.location.href = '/login';
			return;
		}
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			// In a real app, fetch instructor-specific data
			stats = {
				totalStudents: 45,
				activeCourses: 3,
				pendingReviews: 12,
				upcomingClasses: 2
			};
		} catch (e: any) {
			console.error(e);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Instructor Dashboard - ProSiya LMS</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar 
		userRole="instructor"
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>
	
	<main class="dashboard-main">
		<div class="dashboard-header">
			<div>
				<h1>Welcome back, {$auth.user?.first_name || 'Instructor'}! 👨‍🏫</h1>
				<p class="subtitle">Manage your courses and students</p>
			</div>
		</div>

		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Loading dashboard...</p>
			</div>
		{:else}
			<div class="stats-grid" in:fade>
				<div class="stat-card">
					<div class="stat-icon">👥</div>
					<div class="stat-content">
						<h3>{stats.totalStudents}</h3>
						<p>Total Students</p>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon">📚</div>
					<div class="stat-content">
						<h3>{stats.activeCourses}</h3>
						<p>Active Courses</p>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon">📝</div>
					<div class="stat-content">
						<h3>{stats.pendingReviews}</h3>
						<p>Pending Reviews</p>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon">🎯</div>
					<div class="stat-content">
						<h3>{stats.upcomingClasses}</h3>
						<p>Upcoming Classes</p>
					</div>
				</div>
			</div>

			<div class="quick-actions" in:fade>
				<h2>Quick Actions</h2>
				<div class="actions-grid">
					<Button href="/instructor/verification" variant="accent" className="action-btn">
						<span class="btn-icon">🎯</span>
						Review Evidence
					</Button>
					<Button href="/instructor/courses" variant="navy" className="action-btn">
						<span class="btn-icon">📚</span>
						Manage Courses
					</Button>
					<Button href="/instructor/students" variant="outline" className="action-btn">
						<span class="btn-icon">👥</span>
						View Students
					</Button>
					<Button href="/instructor/schedule" variant="outline" className="action-btn">
						<span class="btn-icon">📅</span>
						Class Schedule
					</Button>
				</div>
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

	.dashboard-header {
		margin-bottom: 2rem;
	}

	.dashboard-header h1 {
		font-size: 2rem;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: 1.125rem;
	}

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

	.quick-actions h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 1.5rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.loading-container {
		text-align: center;
		padding: 5rem;
	}

	.loader {
		border: 4px solid var(--color-bg-light);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: 0 auto 1.5rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.dashboard-main { margin-left: 0; }
	}
</style>
