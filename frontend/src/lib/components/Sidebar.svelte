<script lang="ts">
	// Sidebar navigation component for student/instructor/admin portals
	// Matches the dark navy sidebar from mockup
	export let userRole: 'student' | 'instructor' | 'admin' = 'student';
	export let userName: string = 'User Name';
	export let userAvatar: string = '/images/instructors/instructor-1.png';
	
	// Navigation items based on role
	const navItems = {
		student: [
			{ icon: '📊', label: 'Dashboard', href: '/student/dashboard' },
			{ icon: '📚', label: 'My Courses', href: '/student/courses' },
			{ icon: '🎥', label: 'Live Classes', href: '/student/live' },
			{ icon: '📝', label: 'Assessments', href: '/student/assessments' },
			{ icon: '🎓', label: 'Certificates', href: '/student/certificates' },
			{ icon: '⚙️', label: 'Settings', href: '/student/settings' }
		],
		instructor: [
			{ icon: '📊', label: 'Dashboard', href: '/instructor/dashboard' },
			{ icon: '📚', label: 'My Courses', href: '/instructor/courses' },
			{ icon: '👥', label: 'Students', href: '/instructor/students' },
			{ icon: '📝', label: 'Assessments', href: '/instructor/assessments' },
			{ icon: '📋', label: 'Evidence Review', href: '/instructor/evidence' },
			{ icon: '📅', label: 'Schedule', href: '/instructor/schedule' }
		],
		admin: [
			{ icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
			{ icon: '👥', label: 'Users', href: '/admin/users' },
			{ icon: '📚', label: 'Courses', href: '/admin/courses' },
			{ icon: '🏢', label: 'Tenants', href: '/admin/tenants' },
			{ icon: '🎓', label: 'Certificates', href: '/admin/certificates' },
			{ icon: '📋', label: 'Audit Logs', href: '/admin/audit' },
			{ icon: '⚙️', label: 'Settings', href: '/admin/settings' }
		]
	};
	
	$: currentNavItems = navItems[userRole];
</script>

<aside class="sidebar">
	<!-- User Profile Section -->
	<div class="user-profile">
		<img src={userAvatar} alt={userName} class="user-avatar" />
		<div class="user-info">
			<h4 class="user-name">{userName}</h4>
			<p class="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
		</div>
	</div>
	
	<!-- Navigation -->
	<nav class="sidebar-nav">
		{#each currentNavItems as item}
			<a href={item.href} class="nav-item">
				<span class="nav-icon">{item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>
	
	<!-- Logout -->
	<div class="sidebar-footer">
		<a href="/logout" class="nav-item logout">
			<span class="nav-icon">🚪</span>
			<span class="nav-label">Logout</span>
		</a>
	</div>
</aside>

<style>
	.sidebar {
		background: var(--color-navy-dark);
		color: white;
		width: 280px;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		padding: 2rem 0;
		overflow-y: auto;
		z-index: 50;
	}
	
	/* User Profile */
	.user-profile {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 1.5rem;
		margin-bottom: 2rem;
	}
	
	.user-avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-accent);
	}
	
	.user-info {
		flex: 1;
		min-width: 0;
	}
	
	.user-name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.user-role {
		font-size: 0.875rem;
		margin: 0;
		color: var(--color-text-dark-secondary);
	}
	
	/* Navigation */
	.sidebar-nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.875rem 1.5rem;
		color: white;
		text-decoration: none;
		transition: all 0.2s ease;
		position: relative;
	}
	
	.nav-item:hover {
		background: var(--color-navy);
	}
	
	.nav-item.active {
		background: var(--color-navy);
		border-left: 4px solid var(--color-accent);
	}
	
	.nav-icon {
		font-size: 1.25rem;
		width: 24px;
		text-align: center;
	}
	
	.nav-label {
		font-size: 0.95rem;
		font-weight: 500;
	}
	
	/* Footer */
	.sidebar-footer {
		padding-top: 1rem;
		border-top: 1px solid var(--color-navy);
	}
	
	.logout {
		color: var(--color-text-dark-secondary);
	}
	
	.logout:hover {
		color: white;
		background: rgba(239, 68, 68, 0.1);
	}
	
	/* Mobile Responsive */
	@media (max-width: 1024px) {
		.sidebar {
			transform: translateX(-100%);
			transition: transform 0.3s ease;
		}
		
		.sidebar.open {
			transform: translateX(0);
		}
	}
	
	/* Scrollbar Styling */
	.sidebar::-webkit-scrollbar {
		width: 6px;
	}
	
	.sidebar::-webkit-scrollbar-track {
		background: var(--color-navy);
	}
	
	.sidebar::-webkit-scrollbar-thumb {
		background: var(--color-navy-light);
		border-radius: 3px;
	}
	
	.sidebar::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent);
	}
</style>
