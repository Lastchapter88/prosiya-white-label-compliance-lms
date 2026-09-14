<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, isAppAdmin } from '$lib/stores/auth';
	import { Sidebar, Button, Badge } from '$lib/components';
	import { studyMaterialService, type MaterialAccess } from '$lib/services/studyMaterial';
	import { accessStatusLabel } from '$lib/utils/courseAccess';

	let records: MaterialAccess[] = [];
	let loading = true;
	let error: string | null = null;
	let actingId: string | null = null;
	let filter: 'pending' | 'approved' | 'denied' | 'all' = 'pending';
	let searchQuery = '';

	$: filtered = records.filter((record) => {
		if (filter !== 'all' && record.status !== filter) return false;
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		return (
			record.userName.toLowerCase().includes(q) ||
			record.userEmail.toLowerCase().includes(q) ||
			record.courseTitle.toLowerCase().includes(q)
		);
	});

	$: pendingCount = records.filter((r) => r.status === 'pending').length;
	$: approvedCount = records.filter((r) => r.status === 'approved').length;
	$: deniedCount = records.filter((r) => r.status === 'denied').length;

	onMount(async () => {
		if (!isAppAdmin($auth.user)) {
			goto('/login?redirect=/admin/study-material');
			return;
		}
		await loadRecords();
	});

	async function loadRecords() {
		loading = true;
		error = null;
		try {
			records = await studyMaterialService.listAllAccess();
		} catch (e: any) {
			error = e.message || 'Could not load course applications';
		} finally {
			loading = false;
		}
	}

	async function approve(record: MaterialAccess) {
		const adminUid = $auth.user?.id;
		if (!adminUid) return;
		if (!confirm(`Grant ${record.userName || record.userEmail} access to ${record.courseTitle}?`)) return;
		actingId = record.id;
		try {
			await studyMaterialService.approveAccess(record.id, adminUid);
			record.status = 'approved';
			records = [...records];
		} catch (e: any) {
			alert(e.message || 'Could not approve this application');
		} finally {
			actingId = null;
		}
	}

	async function deny(record: MaterialAccess) {
		const adminUid = $auth.user?.id;
		if (!adminUid) return;
		if (!confirm(`Decline access to ${record.courseTitle} for ${record.userName || record.userEmail}?`)) return;
		actingId = record.id;
		try {
			await studyMaterialService.denyAccess(record.id, adminUid);
			record.status = 'denied';
			records = [...records];
		} catch (e: any) {
			alert(e.message || 'Could not decline this application');
		} finally {
			actingId = null;
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

	function badgeVariant(status: MaterialAccess['status']) {
		if (status === 'approved') return 'success';
		if (status === 'denied') return 'error';
		return 'warning';
	}
</script>

<svelte:head>
	<title>Course applications - ProSiya Admin</title>
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
				<h1>Course applications</h1>
				<p class="subtitle">
					Signing in does not unlock courses. Approve each programme after payment is confirmed.
					Until then learners can only apply and send proof of payment.
				</p>
			</div>
			<button class="refresh-btn" type="button" on:click={loadRecords} disabled={loading}>
				{loading ? 'Refreshing…' : 'Refresh'}
			</button>
		</div>

		<div class="stats-row">
			<button class="stat-card" class:active={filter === 'pending'} type="button" on:click={() => (filter = 'pending')}>
				<span>Pending</span>
				<strong>{pendingCount}</strong>
			</button>
			<button class="stat-card approved" class:active={filter === 'approved'} type="button" on:click={() => (filter = 'approved')}>
				<span>Approved</span>
				<strong>{approvedCount}</strong>
			</button>
			<button class="stat-card denied" class:active={filter === 'denied'} type="button" on:click={() => (filter = 'denied')}>
				<span>Declined</span>
				<strong>{deniedCount}</strong>
			</button>
			<button class="stat-card" class:active={filter === 'all'} type="button" on:click={() => (filter = 'all')}>
				<span>All</span>
				<strong>{records.length}</strong>
			</button>
		</div>

		<div class="toolbar">
			<input
				type="search"
				placeholder="Search learner, email, or course…"
				bind:value={searchQuery}
				aria-label="Search applications"
			/>
		</div>

		<div class="list-container">
			{#if loading}
				<div class="empty-state">Loading applications…</div>
			{:else if error}
				<div class="empty-state error">{error}</div>
			{:else if filtered.length === 0}
				<div class="empty-state">
					{searchQuery ? 'No applications match your search.' : 'No applications in this list.'}
				</div>
			{:else}
				<table class="access-table">
					<thead>
						<tr>
							<th>Learner</th>
							<th>Course</th>
							<th>Applied</th>
							<th>Status</th>
							<th class="text-right">Authorise</th>
						</tr>
					</thead>
					<tbody>
						{#each filtered as record (record.id)}
							<tr>
								<td>
									<div class="learner">
										<strong>{record.userName || '—'}</strong>
										<span>{record.userEmail}</span>
									</div>
								</td>
								<td>{record.courseTitle}</td>
								<td>{formatDate(record.requestedAt)}</td>
								<td>
									<Badge variant={badgeVariant(record.status)}>
										{accessStatusLabel(record.status)}
									</Badge>
								</td>
								<td class="text-right">
									{#if record.status !== 'approved'}
										<Button
											variant="success"
											size="sm"
											disabled={actingId === record.id}
											on:click={() => approve(record)}
										>
											Approve
										</Button>
									{/if}
									{#if record.status !== 'denied'}
										<Button
											variant="outline"
											size="sm"
											disabled={actingId === record.id}
											on:click={() => deny(record)}
										>
											{record.status === 'approved' ? 'Revoke' : 'Decline'}
										</Button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
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
		gap: 1rem;
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0;
		color: var(--color-navy-dark);
	}
	.subtitle {
		margin: 0.5rem 0 0;
		color: var(--color-text-secondary);
		max-width: 44rem;
		line-height: 1.5;
	}
	.refresh-btn {
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.625rem 1rem;
		font-weight: 600;
		cursor: pointer;
	}
	.stats-row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}
	.stat-card {
		background: white;
		border: 2px solid transparent;
		border-radius: 10px;
		padding: 0.9rem 1rem;
		text-align: left;
		cursor: pointer;
		box-shadow: var(--shadow-card);
	}
	.stat-card span {
		display: block;
		color: var(--color-text-secondary);
		font-size: 0.85rem;
	}
	.stat-card strong {
		font-size: 1.5rem;
		color: var(--color-navy-dark);
	}
	.stat-card.active {
		border-color: var(--color-navy-dark);
	}
	.stat-card.approved.active {
		border-color: #16a34a;
	}
	.stat-card.denied.active {
		border-color: #dc2626;
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
	}
	.list-container {
		background: white;
		border-radius: 8px;
		box-shadow: var(--shadow-card);
		overflow: hidden;
	}
	.access-table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 1rem 1.15rem;
		text-align: left;
		border-bottom: 1px solid #f3f4f6;
		vertical-align: middle;
	}
	th {
		background: #f9fafb;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-navy);
	}
	.learner {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.learner span {
		color: var(--color-text-secondary);
		font-size: 0.85rem;
	}
	.text-right {
		text-align: right;
		white-space: nowrap;
	}
	.empty-state {
		padding: 3rem;
		text-align: center;
		color: var(--color-text-secondary);
	}
	.empty-state.error {
		color: var(--color-error);
	}
	@media (max-width: 1024px) {
		.dashboard-main {
			margin-left: 0;
		}
		.stats-row {
			grid-template-columns: 1fr 1fr;
		}
		.list-container {
			overflow-x: auto;
		}
	}
</style>
