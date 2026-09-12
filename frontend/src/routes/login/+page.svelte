<script lang="ts">
	import { authService } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { friendlyAuthError } from '$lib/utils/authErrors';

	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let googleLoading = false;
	let error = '';

	onMount(async () => {
		const result = await authService.handleGoogleRedirect();
		if (result.error) {
			error = friendlyAuthError({ message: result.error });
			return;
		}
		if (result.user) {
			const redirect = result.redirectUrl || $page.url.searchParams.get('redirect') || '/student/dashboard';
			await goto(redirect);
		}
	});

	async function handleLogin(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = '';
		try {
			await authService.login({ email, password });
			const redirect = $page.url.searchParams.get('redirect') || '/student/dashboard';
			await goto(redirect);
		} catch (err: any) {
			console.error('Login error:', err);
			error = friendlyAuthError(err);
		} finally {
			isLoading = false;
		}
	}

	function handleGoogleSignIn() {
		error = '';
		googleLoading = true;
		const redirect = $page.url.searchParams.get('redirect') || '/student/dashboard';
		authService.loginWithGoogle(redirect).catch((err: any) => {
			console.error('Google sign-in error:', err);
			error = friendlyAuthError(err);
			googleLoading = false;
		});
	}
</script>

<svelte:head>
	<title>Login - ProSiya LMS</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<!-- Left Side - Branding -->
		<div class="auth-branding">
			<div class="branding-content">
				<h2 class="brand-name">ProSiya Academy</h2>
				<h1>Welcome Back</h1>
				<p>Continue your professional security and firearms training journey</p>
				
				<p class="accreditation-text">PSIRA • QCTO • SASSETA Accredited</p>
			</div>
		</div>
		
		<!-- Right Side - Login Form -->
		<div class="auth-form-container">
			<div class="auth-form">
				<div class="form-logo">
					<span class="form-logo-text">ProSiya LMS</span>
				</div>
				<div class="form-header">
					<h2>Sign In</h2>
					<p>Enter your credentials to access your account</p>
				</div>
				
				{#if error}
					<div class="error-message">
						⚠️ {error}
					</div>
				{/if}
				
				<form on:submit={handleLogin}>
					<div class="form-group">
						<label for="email">Email Address</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="your.email@example.com"
							required
							disabled={isLoading}
						/>
					</div>
					
					<div class="form-group">
						<label for="password">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Enter your password"
							required
							disabled={isLoading}
						/>
					</div>
					
					<div class="form-options">
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:checked={rememberMe}
								disabled={isLoading}
							/>
							<span>Remember me</span>
						</label>
						
						<a href="/forgot-password" class="forgot-link">Forgot password?</a>
					</div>
					
					<Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>
				
				<div class="divider">
					<span>or</span>
				</div>
				
				<div class="social-login">
					<button type="button" class="btn-social" on:click={handleGoogleSignIn} disabled={googleLoading || isLoading}>
						<span class="social-icon">G</span>
						{googleLoading ? 'Signing in...' : 'Continue with Google'}
					</button>
				</div>
				
				<div class="form-footer">
					<p>Don't have an account? <a href="/register">Sign up</a></p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-light);
		padding: 2rem;
	}
	
	.auth-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		max-width: 1200px;
		width: 100%;
		background: white;
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
		overflow: hidden;
	}
	
	/* Branding Side */
	.auth-branding {
		background: var(--color-navy-dark);
		color: white;
		padding: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.branding-content {
		text-align: center;
	}
	
	.brand-name {
		font-size: 1.75rem;
		font-weight: 800;
		color: white;
		letter-spacing: 0.02em;
		margin-bottom: 2rem;
	}
	
	.auth-branding h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
	}
	
	.auth-branding p {
		font-size: 1.125rem;
		color: var(--color-text-dark-secondary);
		margin-bottom: 3rem;
		line-height: 1.6;
	}
	
	.accreditation-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-dark-secondary);
		letter-spacing: 0.5px;
		margin: 0;
	}
	
	/* Form Side */
	.auth-form-container {
		padding: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.auth-form {
		width: 100%;
		max-width: 400px;
	}

	.form-logo {
		text-align: center;
		margin-bottom: 2rem;
	}

	.form-logo-text {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		letter-spacing: 0.02em;
	}
	
	.form-header {
		margin-bottom: 2rem;
	}
	
	.form-header h2 {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}
	
	.form-header p {
		color: var(--color-text-secondary);
	}
	
	.error-message {
		background: rgba(239, 68, 68, 0.1);
		color: var(--color-error);
		padding: 1rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.5rem;
		border-left: 4px solid var(--color-error);
	}
	
	.form-group {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		font-weight: 600;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}
	
	input[type="email"],
	input[type="password"] {
		width: 100%;
		padding: 0.875rem 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 1rem;
		transition: all 0.2s ease;
	}
	
	input:focus {
		outline: none;
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(253, 185, 19, 0.1);
	}
	
	input:disabled {
		background: var(--color-bg-light);
		cursor: not-allowed;
	}
	
	.form-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: normal;
		cursor: pointer;
	}
	
	.checkbox-label input[type="checkbox"] {
		width: auto;
		cursor: pointer;
	}
	
	.forgot-link {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
		transition: color 0.2s ease;
	}
	
	.forgot-link:hover {
		color: var(--color-accent-dark);
	}
	
	.divider {
		position: relative;
		text-align: center;
		margin: 2rem 0;
	}
	
	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--color-border);
	}
	
	.divider span {
		position: relative;
		background: white;
		padding: 0 1rem;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
	}
	
	.social-login {
		margin-bottom: 2rem;
	}
	
	.btn-social {
		width: 100%;
		padding: 1rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		font-size: 1rem;
		background: white;
		color: var(--color-navy-dark);
		border: 2px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.btn-social:hover {
		border-color: var(--color-navy-dark);
		background: var(--color-bg-light);
	}
	
	.social-icon {
		font-weight: 800;
		font-size: 1.25rem;
	}
	
	.form-footer {
		text-align: center;
		color: var(--color-text-secondary);
	}
	
	.form-footer a {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}
	
	.form-footer a:hover {
		color: var(--color-accent-dark);
	}
	
	/* Responsive */
	@media (max-width: 1024px) {
		.auth-container {
			grid-template-columns: 1fr;
		}
		
		.auth-branding {
			padding: 3rem 2rem;
		}
		
		.auth-form-container {
			padding: 3rem 2rem;
		}
	}
	
	@media (max-width: 640px) {
		.auth-page {
			padding: 1rem;
		}
		
		.auth-branding h1 {
			font-size: 2rem;
		}
		
		.form-header h2 {
			font-size: 1.75rem;
		}
	}
</style>
