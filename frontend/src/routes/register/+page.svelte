<script lang="ts">
	import { authService } from '$lib/services/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { friendlyAuthError } from '$lib/utils/authErrors';

	let formData = {
		first_name: '',
		last_name: '',
		email: '',
		phone_number: '', // Note: Backend usually handles this in profile, but we can send it
		password: '',
		confirmPassword: '',
		agreeToTerms: false
	};
	
	let isLoading = false;
	let googleLoading = false;
	let errors: Record<string, string> = {};
	let globalError = '';

	onMount(async () => {
		const result = await authService.handleGoogleRedirect();
		if (result.error) {
			globalError = friendlyAuthError({ message: result.error });
			return;
		}
		if (result.user) {
			const redirect = result.redirectUrl || $page.url.searchParams.get('redirect') || '/student/dashboard';
			await goto(redirect);
		}
	});
	
	function validateForm() {
		errors = {};
		
		if (!formData.first_name) errors.first_name = 'First name is required';
		if (!formData.last_name) errors.last_name = 'Last name is required';
		if (!formData.email) errors.email = 'Email is required';
		if (!formData.password) errors.password = 'Password is required';
		if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
		}
		if (!formData.agreeToTerms) errors.terms = 'You must agree to the terms and conditions';
		
		return Object.keys(errors).length === 0;
	}
	
	async function handleRegister(event: Event) {
		event.preventDefault();
		
		if (!validateForm()) return;
		
		isLoading = true;
		globalError = '';
		
		try {
			await authService.register(formData);
			const redirect = $page.url.searchParams.get('redirect') || '/student/dashboard';
			await goto(redirect);
		} catch (err: any) {
			console.error('Registration error:', err);
			globalError = friendlyAuthError(err);
		} finally {
			isLoading = false;
		}
	}

	async function handleGoogleSignUp() {
		globalError = '';
		googleLoading = true;
		try {
			const redirect = $page.url.searchParams.get('redirect') || '/student/dashboard';
			await authService.loginWithGoogle(redirect);
		} catch (err: any) {
			console.error('Google sign-up error:', err);
			globalError = friendlyAuthError(err);
			googleLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Register - ProSiya LMS</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<!-- Left Side - Branding -->
		<div class="auth-branding">
			<div class="branding-content">
				<img src="/images/logos/prosiya-logo.png" alt="ProSiya Academy" class="logo" />
				<h1>Start Your Journey</h1>
				<p>Join thousands of professionals advancing their careers in security and firearms training</p>
				
				<div class="benefits">
					<div class="benefit-item">
						<span class="benefit-icon">✓</span>
						<span>PSIRA, QCTO & SASSETA Accredited</span>
					</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span>
						<span>Flexible Online & Practical Training</span>
					</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span>
						<span>Lifetime Access to Course Materials</span>
					</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span>
						<span>Industry-Recognized Certificates</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Right Side - Registration Form -->
		<div class="auth-form-container">
			<div class="auth-form">
				<div class="form-logo">
					<img src="/images/logos/prosiya-logo.png" alt="ProSiya LMS" />
				</div>
				<div class="form-header">
					<h2>Create Account</h2>
					<p>Fill in your details to get started</p>
				</div>
                
                {#if globalError}
                    <div class="error-box">
                        ⚠️ {globalError}
                    </div>
                {/if}
				
				<form on:submit={handleRegister}>
					<div class="form-row">
						<div class="form-group">
							<label for="first_name">First Name *</label>
							<input
								type="text"
								id="first_name"
								bind:value={formData.first_name}
								placeholder="John"
								required
								disabled={isLoading}
							/>
							{#if errors.first_name}
								<span class="error-text">{errors.first_name}</span>
							{/if}
						</div>
						
						<div class="form-group">
							<label for="last_name">Last Name *</label>
							<input
								type="text"
								id="last_name"
								bind:value={formData.last_name}
								placeholder="Doe"
								required
								disabled={isLoading}
							/>
							{#if errors.last_name}
								<span class="error-text">{errors.last_name}</span>
							{/if}
						</div>
					</div>
					
					<div class="form-group">
						<label for="email">Email Address *</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							placeholder="your.email@example.com"
							required
							disabled={isLoading}
						/>
						{#if errors.email}
							<span class="error-text">{errors.email}</span>
						{/if}
					</div>
					
					<div class="form-group">
						<label for="password">Password *</label>
						<input
							type="password"
							id="password"
							bind:value={formData.password}
							placeholder="Minimum 8 characters"
							required
							disabled={isLoading}
						/>
						{#if errors.password}
							<span class="error-text">{errors.password}</span>
						{/if}
					</div>
					
					<div class="form-group">
						<label for="confirmPassword">Confirm Password *</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={formData.confirmPassword}
							placeholder="Re-enter your password"
							required
							disabled={isLoading}
						/>
						{#if errors.confirmPassword}
							<span class="error-text">{errors.confirmPassword}</span>
						{/if}
					</div>
					
					<div class="form-group">
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:checked={formData.agreeToTerms}
								disabled={isLoading}
							/>
							<span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
						</label>
						{#if errors.terms}
							<span class="error-text">{errors.terms}</span>
						{/if}
					</div>
					
					<Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
						{isLoading ? 'Creating Account...' : 'Create Account'}
					</Button>
				</form>
				
				<div class="divider">
					<span>or</span>
				</div>
				
				<div class="social-login">
					<button
						type="button"
						class="btn-social"
						on:click={handleGoogleSignUp}
						disabled={googleLoading || isLoading}
					>
						<span class="social-icon">G</span>
						{googleLoading ? 'Signing up...' : 'Sign up with Google'}
					</button>
				</div>
				
				<div class="form-footer">
					<p>Already have an account? <a href="/login">Sign in</a></p>
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
	
	.logo {
		width: 240px;
		height: auto;
		margin-bottom: 2rem;
		filter: brightness(0) invert(1);
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
	
	.benefits {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}
	
	.benefit-item {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.benefit-icon {
		color: var(--color-accent);
		font-weight: bold;
		font-size: 1.5rem;
		flex-shrink: 0;
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
		max-width: 450px;
	}

	.form-logo {
		text-align: center;
		margin-bottom: 2rem;
	}

	.form-logo img {
		max-width: 180px;
		height: auto;
	}
	
	.form-header {
		margin-bottom: 2rem;
	}
	
    .error-box {
        background: rgba(239, 68, 68, 0.1);
		color: var(--color-error);
		padding: 1rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.5rem;
		border-left: 4px solid var(--color-error);
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
	
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	
	.form-group {
		margin-bottom: 1.25rem;
	}
	
	label {
		display: block;
		font-weight: 600;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}
	
	input[type="text"],
	input[type="email"],
	input[type="password"] {
		width: 100%;
		padding: 0.75rem 1rem;
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
	
	.error-text {
		display: block;
		color: var(--color-error);
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}
	
	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-weight: normal;
		cursor: pointer;
		font-size: 0.9rem;
	}
	
	.checkbox-label input[type="checkbox"] {
		width: auto;
		margin-top: 0.25rem;
		cursor: pointer;
	}
	
	.checkbox-label a {
		color: var(--color-accent);
		text-decoration: none;
	}
	
	.divider {
		position: relative;
		text-align: center;
		margin: 1.5rem 0;
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
		font-size: 0.8rem;
	}
	
	.social-login {
		margin-bottom: 1.5rem;
	}
	
	.btn-social {
		width: 100%;
		padding: 0.875rem;
		border-radius: var(--radius-md);
		font-weight: 700;
		background: white;
		color: var(--color-navy-dark);
		border: 2px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		cursor: pointer;
	}
	
	.social-icon {
		font-weight: 800;
		font-size: 1.25rem;
	}
	
	.form-footer {
		text-align: center;
		color: var(--color-text-secondary);
        font-size: 0.95rem;
	}
	
	.form-footer a {
		color: var(--color-accent);
		font-weight: 600;
		text-decoration: none;
	}
	
	@media (max-width: 1024px) {
		.auth-container { grid-template-columns: 1fr; }
		.auth-branding { display: none; }
		.auth-form-container { padding: 2rem 1rem; }
	}
</style>
