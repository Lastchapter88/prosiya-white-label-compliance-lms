<script lang="ts">
	import { Sidebar, Badge, Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { auth, isAppAdmin } from '$lib/stores/auth';
	import { firestoreUserService } from '$lib/services/firestoreUsers';
	import { fade } from 'svelte/transition';

	let stats = {
		totalUsers: 0,
		paidUsers: 0,
		unpaidUsers: 0,
		activeCourses: 10
	};
	let isLoading = true;

	onMount(async () => {
		if (!$auth.isAuthenticated || !isAppAdmin($auth.user)) {
			window.location.href = '/login?redirect=/admin/dashboard';
			return;
		}
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			const users = await firestoreUserService.listRegisteredUsers();
			stats = {
				totalUsers: users.length,
				paidUsers: users.filter((u) => u.paymentStatus === 'paid').length,
				unpaidUsers: users.filter((u) => u.paymentStatus !== 'paid').length,
				activeCourses: 10
			};
		} catch (e: any) {
			console.error(e);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard - ProSiya LMS</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar 
		userRole="admin"
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>
	
	<main class="dashboard-main">
		<div class="dashboard-header">
			<div>
				<h1>System Administration 🛡️</h1>
				<p class="subtitle">Manage the entire ProSiya LMS platform</p>
			</div>
		</div>

		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Loading system metrics...</p>
			</div>
		{:else}
			<div class="stats-grid" in:fade>
				<div class="stat-card">
					<div class="stat-icon">👥</div>
					<div class="stat-content">
						<h3>{stats.totalUsers}</h3>
						<p>Total Users</p>
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
					<div class="stat-icon">✅</div>
					<div class="stat-content">
						<h3>{stats.paidUsers}</h3>
						<p>Paid Learners</p>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon">⏳</div>
					<div class="stat-content">
						<h3>{stats.unpaidUsers}</h3>
						<p>Awaiting Payment</p>
					</div>
				</div>
			</div>

			<div class="admin-sections" in:fade>
				<div class="section">
					<h2>User Management</h2>
					<p class="section-desc">
						Signing in does not unlock courses. Approve each learner application after payment is confirmed.
					</p>
					<div class="section-actions">
						<Button href="/admin/users" variant="navy">Manage Registered Users</Button>
						<Button href="/admin/study-material" variant="outline">Course applications</Button>
					</div>
				</div>

				<div class="section">
					<h2>Content Management</h2>
					<div class="section-actions">
						<Button href="/admin/courses" variant="navy">Manage Courses</Button>
						<Button href="/admin/courses/create" variant="outline">Create Course</Button>
					</div>
				</div>

				<div class="section">
					<h2>Compliance & Audit</h2>
					<div class="section-actions">
						<Button href="/admin/compliance/audit" variant="accent">View Audit Logs</Button>
						<Button href="/admin/compliance/certificates" variant="outline">Manage Certificates</Button>
					</div>
				</div>

				<div class="section">
					<h2>System Settings</h2>
					<div class="section-actions">
						<Button href="/admin/tenants" variant="navy">Tenant Management</Button>
						<Button href="/admin/settings" variant="outline">System Settings</Button>
					</div>
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

	.admin-sections {
		display: grid;
		gap: 2rem;
	}

	.section {
		background: white;
		padding: 2rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.section h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}

	.section-desc {
		color: var(--color-text-secondary);
		margin: 0 0 1.25rem;
		line-height: 1.5;
	}

	.section-actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
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
