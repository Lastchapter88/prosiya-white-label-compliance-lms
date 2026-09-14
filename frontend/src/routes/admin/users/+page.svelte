<script lang="ts">
	import { onMount } from 'svelte';
	import { Sidebar, Badge } from '$lib/components';
	import { auth } from '$lib/stores/auth';
	import {
		firestoreUserService,
		type FirestoreUser
	} from '$lib/services/firestoreUsers';

	let users: FirestoreUser[] = [];
	let loading = true;
	let error: string | null = null;
	let togglingId: string | null = null;
	let searchQuery = '';

	$: filteredUsers = users.filter((user) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		const name = `${user.firstName} ${user.lastName}`.toLowerCase();
		return (
			name.includes(q) ||
			user.email.toLowerCase().includes(q) ||
			user.role.toLowerCase().includes(q)
		);
	});

	$: paidCount = users.filter((u) => u.paymentStatus === 'paid').length;
	$: unpaidCount = users.filter((u) => u.paymentStatus !== 'paid').length;

	onMount(async () => {
		await loadUsers();
	});

	async function loadUsers() {
		loading = true;
		error = null;
		try {
			users = await firestoreUserService.listRegisteredUsers();
		} catch (e: any) {
			error = e.message || 'Failed to load registered users';
		} finally {
			loading = false;
		}
	}

	async function togglePayment(user: FirestoreUser) {
		const adminUid = $auth.user?.id;
		if (!adminUid) return;

		const nextStatus = user.paymentStatus === 'paid' ? 'unpaid' : 'paid';
		const label = nextStatus === 'paid' ? 'mark as paid' : 'mark as unpaid';
		const name = `${user.firstName} ${user.lastName}`.trim() || user.email;

		if (!confirm(`Are you sure you want to ${label} for ${name}?`)) return;

		togglingId = user.id;
		try {
			await firestoreUserService.setPaymentStatus(user.id, nextStatus, adminUid);
			user.paymentStatus = nextStatus;
			users = [...users];
		} catch (e: any) {
			alert(e.message || 'Could not update payment status');
		} finally {
			togglingId = null;
		}
	}

	function formatDate(iso: string) {
		if (!iso) return '—';
		try {
			return new Date(iso).toLocaleDateString('en-ZA', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch {
			return '—';
		}
	}
</script>

<svelte:head>
	<title>Registered Users - ProSiya Admin</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar
		userRole="admin"
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>

	<main class="dashboard-main">
		<div class="page-header">
			<div>
				<h1>Registered Users</h1>
				<p class="subtitle">
					View everyone who has signed up. Payment status is a record only — course access is
					approved per programme under Course applications.
				</p>
			</div>
			<button class="refresh-btn" type="button" on:click={loadUsers} disabled={loading}>
				{loading ? 'Refreshing…' : 'Refresh'}
			</button>
		</div>

		<div class="stats-row">
			<div class="stat-card">
				<span class="stat-label">Total registered</span>
				<strong class="stat-value">{users.length}</strong>
			</div>
			<div class="stat-card paid">
				<span class="stat-label">Marked paid</span>
				<strong class="stat-value">{paidCount}</strong>
			</div>
			<div class="stat-card unpaid">
				<span class="stat-label">Unpaid / awaiting proof</span>
				<strong class="stat-value">{unpaidCount}</strong>
			</div>
		</div>

		<div class="toolbar">
			<input
				type="search"
				placeholder="Search by name, email, or role…"
				bind:value={searchQuery}
				aria-label="Search users"
			/>
		</div>

		<div class="user-list-container">
			{#if loading}
				<div class="empty-state">Loading registered users…</div>
			{:else if error}
				<div class="empty-state error">{error}</div>
			{:else if filteredUsers.length === 0}
				<div class="empty-state">
					<p>{searchQuery ? 'No users match your search.' : 'No registered users yet.'}</p>
				</div>
			{:else}
				<table class="user-table">
					<thead>
						<tr>
							<th>Learner</th>
							<th>Email</th>
							<th>Registered</th>
							<th>Role</th>
							<th>Payment</th>
							<th class="text-right">Payment record</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredUsers as user (user.id)}
							<tr>
								<td>
									<div class="user-cell">
										<div class="user-avatar-placeholder">
											{user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'N'}
										</div>
										<div class="user-info">
											<div class="font-medium">
												{user.firstName || '—'} {user.lastName || ''}
											</div>
										</div>
									</div>
								</td>
								<td>{user.email || '—'}</td>
								<td>{formatDate(user.createdAt)}</td>
								<td>
									<span class="role-badge role-{user.role}">{user.role}</span>
								</td>
								<td>
									<Badge variant={user.paymentStatus === 'paid' ? 'success' : 'warning'}>
										{user.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
									</Badge>
								</td>
								<td class="text-right">
									<label class="toggle" title={user.paymentStatus === 'paid' ? 'Revoke access' : 'Grant access'}>
										<input
											type="checkbox"
											checked={user.paymentStatus === 'paid'}
											disabled={togglingId === user.id || user.role === 'admin'}
											on:change={() => togglePayment(user)}
										/>
										<span class="toggle-slider"></span>
										<span class="toggle-label">
											{user.role === 'admin'
												? 'Admin'
												: user.paymentStatus === 'paid'
													? 'Enabled'
													: 'Locked'}
										</span>
									</label>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<p class="help-text">
			Marking a learner as paid does <strong>not</strong> open their courses. Approve each course on
			the <a href="/admin/study-material">Course applications</a> page after you confirm payment.
			Unpaid learners can enrol and submit an application only.
		</p>
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
		max-width: 1400px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin: 0;
		font-size: 1.8rem;
		color: var(--color-navy-dark);
	}

	.subtitle {
		margin: 0.5rem 0 0;
		color: var(--color-text-light);
		max-width: 42rem;
	}

	.refresh-btn {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.625rem 1rem;
		font-weight: 600;
		color: var(--color-navy);
		cursor: pointer;
	}

	.refresh-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: white;
		border-radius: 10px;
		padding: 1rem 1.25rem;
		box-shadow: var(--shadow-card);
	}

	.stat-card.paid {
		border-left: 4px solid #16a34a;
	}

	.stat-card.unpaid {
		border-left: 4px solid #d97706;
	}

	.stat-label {
		display: block;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin-bottom: 0.35rem;
	}

	.stat-value {
		font-size: 1.75rem;
		color: var(--color-navy-dark);
	}

	.toolbar {
		margin-bottom: 1rem;
	}

	.toolbar input {
		width: 100%;
		max-width: 420px;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background: white;
	}

	.user-list-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.user-table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 1rem 1.25rem;
		text-align: left;
		border-bottom: 1px solid #f3f4f6;
		vertical-align: middle;
	}

	th {
		background: #f9fafb;
		font-weight: 600;
		color: var(--color-navy);
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr:hover {
		background-color: #f9fafb;
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-avatar-placeholder {
		width: 36px;
		height: 36px;
		background: var(--color-navy);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.font-medium {
		font-weight: 500;
		color: var(--color-navy-dark);
	}

	.role-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.role-student {
		background: #e0f2fe;
		color: #0369a1;
	}
	.role-admin {
		background: #e1effe;
		color: #1e40af;
		border: 1px solid #bfdbfe;
	}

	.text-right {
		text-align: right;
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.toggle input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: relative;
		width: 44px;
		height: 24px;
		background: #d1d5db;
		border-radius: 999px;
		transition: background 0.2s;
	}

	.toggle-slider::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 18px;
		height: 18px;
		background: white;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.toggle input:checked + .toggle-slider {
		background: #16a34a;
	}

	.toggle input:checked + .toggle-slider::after {
		transform: translateX(20px);
	}

	.toggle input:disabled + .toggle-slider {
		opacity: 0.5;
	}

	.toggle-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
		min-width: 4.5rem;
		text-align: left;
	}

	.empty-state {
		padding: 3rem;
		text-align: center;
		color: var(--color-text-light);
	}

	.empty-state.error {
		color: var(--color-error);
	}

	.help-text {
		margin-top: 1rem;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.help-text a {
		color: var(--color-navy);
		font-weight: 700;
	}

	@media (max-width: 1024px) {
		.dashboard-main {
			margin-left: 0;
		}

		.stats-row {
			grid-template-columns: 1fr;
		}

		.user-list-container {
			overflow-x: auto;
		}
	}
</style>
