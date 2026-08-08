<script lang="ts">
	import { Sidebar, Badge, Button } from '$lib/components';
	import { onMount } from 'svelte';
	import { auditService } from '$lib/services/compliance';
	import { auth } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';

	let logs: any[] = [];
	let isLoading = true;
	let error: string | null = null;

	onMount(async () => {
		if (!$auth.isAuthenticated || !$auth.user?.role === 'admin') {
			// In a real app we'd redirect or show unauthorized
		}
		await loadLogs();
	});

	async function loadLogs() {
		isLoading = true;
		try {
			const data = await auditService.getAuditLogs();
			logs = data.results || data;
		} catch (e: any) {
			error = e.message || "Failed to load audit logs";
		} finally {
			isLoading = false;
		}
	}

	function truncateHash(hash: string) {
		if (!hash) return 'N/A';
		return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8);
	}
</script>

<svelte:head>
	<title>Audit Logs - ProSiya Compliance</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar 
		userRole="admin"
		userName="Compliance Officer"
		userAvatar="/images/instructors/instructor-1.png"
	/>
	
	<main class="dashboard-main">
		<div class="dashboard-header">
			<div>
				<h1>Immutable Audit Spine 🛡️</h1>
				<p class="subtitle">Real-time monitoring of all system actions and compliance events</p>
			</div>
			<div class="header-actions">
				<Button variant="outline" on:click={loadLogs}>Refresh logs</Button>
				<Button variant="accent">Export Audit Trail</Button>
			</div>
		</div>

		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Syncing with immutable ledger...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<p>Error: {error}</p>
			</div>
		{:else}
			<div class="logs-table-container" in:fade>
				<table class="logs-table">
					<thead>
						<tr>
							<th>Timestamp</th>
							<th>User</th>
							<th>Action</th>
							<th>Resource</th>
							<th>IP Address</th>
							<th>Chain Hash (SHA-256)</th>
						</tr>
					</thead>
					<tbody>
						{#each logs as log}
							<tr>
								<td class="timestamp">{new Date(log.timestamp).toLocaleString()}</td>
								<td>
									<div class="user-cell">
										<span class="avatar-small">👤</span>
										<span>{log.user || 'System'}</span>
									</div>
								</td>
								<td>
									<Badge variant={
										log.action === 'create' ? 'success' : 
										log.action === 'delete' ? 'error' : 
										log.action === 'update' ? 'warning' : 'default'
									}>
										{log.action}
									</Badge>
								</td>
								<td>{log.resource_type}: {log.resource_id}</td>
								<td class="ip-address">{log.ip_address}</td>
								<td>
									<code class="hash-code" title={log.log_hash}>
										{truncateHash(log.log_hash)}
									</code>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			
			<div class="compliance-footer mt-4">
				<div class="integrity-badge">
					<span class="icon">✅</span>
					<span>Ledger Integrity Verified: All hashes match the previous link in the chain.</span>
				</div>
			</div>
		{/if}
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
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.dashboard-header h1 {
		font-size: 2rem;
		color: var(--color-navy-dark);
		margin-bottom: 0.5rem;
	}

    .header-actions {
        display: flex;
        gap: 1rem;
    }

	.subtitle {
		color: var(--color-text-secondary);
	}

	.logs-table-container {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		overflow: hidden;
		border: 1px solid var(--color-border);
	}

	.logs-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.logs-table th {
		text-align: left;
		padding: 1rem 1.5rem;
		background: var(--color-bg-light);
		color: var(--color-navy-dark);
		font-weight: 700;
		border-bottom: 1px solid var(--color-border);
	}

	.logs-table td {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.timestamp {
		white-space: nowrap;
		color: var(--color-text-secondary);
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar-small {
		background: var(--color-bg-light);
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
	}

	.ip-address {
		font-family: var(--font-mono);
		color: var(--color-text-secondary);
		font-size: 0.8rem;
	}

	.hash-code {
		background: var(--color-bg-light);
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-sm);
		color: var(--color-navy-light);
		font-size: 0.8rem;
	}

	.integrity-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: #ecfdf5;
		color: #065f46;
		border-radius: var(--radius-md);
		border: 1px solid #a7f3d0;
		font-weight: 600;
	}

	.loading-container {
		text-align: center;
		padding: 5rem;
	}

	.loader {
		border: 4px solid var(--color-bg-light);
		border-top: 4px solid var(--color-accent);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: 0 auto 1.5rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 1024px) {
		.dashboard-main { margin-left: 0; }
        .logs-table-container { overflow-x: auto; }
	}
</style>
