<script lang="ts">
	import { auth, hasPaidAccess } from '$lib/stores/auth';
	import { companyContact } from '$lib/data/companyProfile';

	$: user = $auth.user;
	$: paid = hasPaidAccess(user);
	$: name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Learner';

	async function logout() {
		await auth.logout();
		window.location.href = '/login';
	}
</script>

<svelte:head>
	<title>More - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Account</p>
	<h1>More</h1>
</div>

<section class="profile">
	<div>
		<strong>{name}</strong>
		<p>{user?.email || ''}</p>
		<p class="status">{paid ? 'Study access unlocked' : 'Payment pending'}</p>
	</div>
</section>

<nav class="menu">
	<a href="/student/assessments">Assessments</a>
	<a href="/student/certificates">Certificates</a>
	<a href="/student/settings">Settings</a>
	<a href="/courses">Browse catalogue</a>
	<a href="tel:{companyContact.phoneTel}">Call {companyContact.phone}</a>
	<a href="mailto:{companyContact.email}">Email the academy</a>
	<button type="button" on:click={logout}>Log out</button>
</nav>

<style>
	.page-head {
		margin-bottom: 1rem;
	}

	.kicker {
		margin: 0 0 0.3rem;
		color: var(--color-text-secondary);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	h1 {
		margin: 0;
		color: var(--color-navy-dark);
		font-size: 1.7rem;
	}

	.profile,
	.menu a,
	.menu button {
		background: var(--color-surface);
		border-radius: 1.05rem;
		box-shadow: var(--shadow-card);
	}

	.profile {
		padding: 1.1rem 1.15rem;
		margin-bottom: 0.85rem;
	}

	.profile strong {
		display: block;
		color: var(--color-navy-dark);
		font-size: 1.1rem;
	}

	.profile p {
		margin: 0.2rem 0 0;
		color: var(--color-text-secondary);
	}

	.status {
		font-weight: 700;
		color: var(--color-navy-dark) !important;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.menu a,
	.menu button {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.95rem 1.1rem;
		color: var(--color-navy-dark);
		text-decoration: none;
		font-weight: 700;
		border: none;
		cursor: pointer;
		font: inherit;
	}

	.menu button {
		color: var(--color-error);
	}
</style>
