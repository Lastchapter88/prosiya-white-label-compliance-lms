<script lang="ts">
	// Header navigation component matching mockup design
	let mobileMenuOpen = false;
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="header">
	<div class="container">
		<div class="header-content">
			<!-- Logo -->
			<a href="/" class="logo-link">
				<img src="/images/logos/prosiya-logo.png" alt="ProSiya Academy" class="logo" />
			</a>
			
			<!-- Desktop Navigation -->
			<nav class="nav-desktop">
				<a href="/courses" class="nav-link">Courses</a>
				<a href="/accreditation" class="nav-link">Accreditation</a>
				<a href="/about" class="nav-link">About</a>
				<a href="/contact" class="nav-link">Contact</a>
			</nav>
			
			<!-- CTA Button -->
			<div class="header-actions">
				<a href="/login" class="btn btn-outline">Login</a>
				<a href="/enroll" class="btn btn-accent">Enroll Now</a>
			</div>
			
			<!-- Mobile Menu Toggle -->
			<button class="mobile-menu-toggle" on:click={toggleMobileMenu} aria-label="Toggle menu">
				<span class="hamburger"></span>
			</button>
		</div>
		
		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<nav class="nav-mobile">
				<a href="/courses" class="nav-link-mobile">Courses</a>
				<a href="/accreditation" class="nav-link-mobile">Accreditation</a>
				<a href="/about" class="nav-link-mobile">About</a>
				<a href="/contact" class="nav-link-mobile">Contact</a>
				<div class="mobile-actions">
					<a href="/login" class="btn btn-outline">Login</a>
					<a href="/enroll" class="btn btn-accent">Enroll Now</a>
				</div>
			</nav>
		{/if}
	</div>
</header>

<style>
	.header {
		background: white;
		box-shadow: var(--shadow-sm);
		position: sticky;
		top: 0;
		z-index: 100;
		padding: 1rem 0;
	}
	
	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}
	
	.logo-link {
		display: flex;
		align-items: center;
	}
	
	.logo {
		height: 80px;
		width: auto;
	}
	
	.nav-desktop {
		display: none;
		gap: 2rem;
		align-items: center;
	}
	
	.nav-link {
		color: var(--color-navy-dark);
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s ease;
		position: relative;
	}
	
	.nav-link:hover {
		color: var(--color-accent);
	}
	
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--color-accent);
		transition: width 0.3s ease;
	}
	
	.nav-link:hover::after {
		width: 100%;
	}
	
	.header-actions {
		display: none;
		gap: 1rem;
		align-items: center;
	}
	
	.btn {
		padding: 0.625rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.3s ease;
		display: inline-block;
		white-space: nowrap;
	}
	
	.btn-outline {
		background: transparent;
		color: var(--color-navy-dark);
		border: 2px solid var(--color-navy-dark);
	}
	
	.btn-outline:hover {
		background: var(--color-navy-dark);
		color: white;
	}
	
	.btn-accent {
		background: var(--color-accent);
		color: var(--color-navy-dark);
		border: 2px solid var(--color-accent);
	}
	
	.btn-accent:hover {
		background: var(--color-accent-dark);
		border-color: var(--color-accent-dark);
	}
	
	/* Mobile Menu Toggle */
	.mobile-menu-toggle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}
	
	.hamburger {
		width: 24px;
		height: 2px;
		background: var(--color-navy-dark);
		position: relative;
		transition: all 0.3s ease;
	}
	
	.hamburger::before,
	.hamburger::after {
		content: '';
		position: absolute;
		width: 24px;
		height: 2px;
		background: var(--color-navy-dark);
		transition: all 0.3s ease;
	}
	
	.hamburger::before {
		top: -8px;
	}
	
	.hamburger::after {
		bottom: -8px;
	}
	
	/* Mobile Navigation */
	.nav-mobile {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem 0;
		border-top: 1px solid var(--color-border);
		margin-top: 1rem;
	}
	
	.nav-link-mobile {
		color: var(--color-navy-dark);
		font-weight: 500;
		text-decoration: none;
		padding: 0.75rem 0;
		transition: color 0.2s ease;
	}
	
	.nav-link-mobile:hover {
		color: var(--color-accent);
	}
	
	.mobile-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	
	.mobile-actions .btn {
		text-align: center;
	}
	
	/* Desktop Styles */
	@media (min-width: 768px) {
		.nav-desktop {
			display: flex;
		}
		
		.header-actions {
			display: flex;
		}
		
		.mobile-menu-toggle {
			display: none;
		}
		
		.nav-mobile {
			display: none;
		}
	}
</style>
