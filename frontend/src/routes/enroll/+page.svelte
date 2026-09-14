<script lang="ts">
	import { Header, Footer, PaymentInstructions } from '$lib/components';
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
					Create an account, apply for a programme, then send proof of payment. An admin must
					authorise each course before you can open lessons.
				</p>
				<div class="actions">
					<a href="/courses" class="btn btn-accent">Browse programmes</a>
					<a href="/register" class="btn btn-outline">Create Account</a>
					<a href="/login" class="btn btn-outline">Sign In</a>
				</div>

				<div class="payment-box">
					<h2>Payment instructions</h2>
					<PaymentInstructions showHeading={false} variant="full" />
				</div>
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
	.payment-box {
		max-width: 640px;
		margin: 0 auto;
		padding: 1.5rem;
		background: white;
		border-radius: var(--radius-lg, 12px);
		border: 1px solid var(--color-border);
		text-align: left;
	}
	.payment-box h2 {
		margin: 0 0 1rem;
		font-size: 1.25rem;
		color: var(--color-navy-dark);
		text-align: center;
	}
</style>
