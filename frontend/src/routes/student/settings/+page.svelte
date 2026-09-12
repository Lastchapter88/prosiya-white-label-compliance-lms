<script lang="ts">
	import { Button } from '$lib/components';
	import { auth } from '$lib/stores/auth';
	import { db } from '$lib/firebase';
	import { doc, updateDoc } from 'firebase/firestore';

	$: user = $auth.user;
	let firstName = '';
	let lastName = '';
	let loading = false;
	let message = '';
	let messageType: 'success' | 'error' = 'success';
	let hydrated = false;

	$: if (user && !hydrated) {
		firstName = user.first_name || '';
		lastName = user.last_name || '';
		hydrated = true;
	}

	async function handleSubmit() {
		if (!user?.id) return;
		loading = true;
		message = '';
		try {
			await updateDoc(doc(db, 'users', user.id), {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				updatedAt: new Date().toISOString()
			});
			message = 'Profile updated.';
			messageType = 'success';
		} catch (e: any) {
			message = e?.message || 'Could not update your profile.';
			messageType = 'error';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Settings - ProSiya Academy</title>
</svelte:head>

<div class="page-head">
	<p class="kicker">Account</p>
	<h1>Settings</h1>
	<p>Keep your learner profile up to date.</p>
</div>

<form class="card" on:submit|preventDefault={handleSubmit}>
	<label>
		First name
		<input type="text" bind:value={firstName} required />
	</label>
	<label>
		Last name
		<input type="text" bind:value={lastName} required />
	</label>
	<label>
		Email
		<input type="email" value={user?.email || ''} disabled />
	</label>

	{#if message}
		<p class="alert {messageType}">{message}</p>
	{/if}

	<Button variant="accent" type="submit" disabled={loading}>
		{loading ? 'Saving…' : 'Save changes'}
	</Button>
</form>

<style>
	.page-head {
		margin-bottom: 1.2rem;
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
		margin: 0 0 0.35rem;
		color: var(--color-navy-dark);
		font-size: 1.7rem;
	}

	.page-head p:last-child {
		margin: 0;
		color: var(--color-text-secondary);
	}

	.card {
		background: var(--color-surface);
		border-radius: 1.15rem;
		box-shadow: var(--shadow-card);
		padding: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		max-width: 560px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 600;
		color: var(--color-navy-dark);
		font-size: 0.9rem;
	}

	input {
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		font: inherit;
		background: var(--color-bg);
		color: var(--color-text);
	}

	input:disabled {
		opacity: 0.7;
	}

	.alert {
		margin: 0;
		padding: 0.75rem 0.85rem;
		border-radius: 0.75rem;
		font-weight: 600;
	}

	.success {
		background: color-mix(in srgb, var(--color-success) 16%, var(--color-surface));
		color: #065f46;
	}

	.error {
		background: color-mix(in srgb, var(--color-error) 14%, var(--color-surface));
		color: var(--color-error);
	}
</style>
