<script lang="ts">
	import { Header, Footer } from '$lib/components';
</script>

<svelte:head>
	<title>Get Started - ProSiya LMS</title>
	<meta name="description" content="Enroll in ProSiya security and firearms training courses. Create an account to get started." />
</svelte:head>

<div class="page">
	<Header />

	<main class="main">
		<section class="enroll-hero">
			<div class="container">
				<h1 class="page-title">Get Started</h1>
				<p class="page-subtitle">
					Create an account to enroll in security grades, firearm competency, armed response, CIT and CPO programmes.
				</p>
				<div class="actions">
					<a href="/register" class="btn btn-accent">Create Account</a>
					<a href="/login" class="btn btn-outline">Sign In</a>
					<a href="/courses" class="btn btn-outline">Browse Courses</a>
				</div>
				<p class="help">
					Questions? Call <a href="tel:+27785236606">+27 78 523 6606</a>
					or email <a href="mailto:info@prosiya.co.za">info@prosiya.co.za</a>
				</p>
			</div>
		</section>
	</main>

	<Footer />
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.main {
		flex: 1;
	}
	.enroll-hero {
		padding: 4rem 0;
		background: var(--color-bg-light);
		text-align: center;
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy-dark);
		margin-bottom: 0.75rem;
	}
	.page-subtitle {
		color: var(--color-text-secondary);
		max-width: 560px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}
	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}
	.btn {
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius-md, 8px);
		font-weight: 700;
		text-decoration: none;
		display: inline-block;
	}
	.btn-accent {
		background: var(--color-accent);
		color: var(--color-navy-dark);
	}
	.btn-outline {
		border: 2px solid var(--color-navy-dark);
		color: var(--color-navy-dark);
	}
	.help {
		color: var(--color-text-secondary);
	}
	.help a {
		color: var(--color-navy-dark);
		font-weight: 600;
	}
</style>
