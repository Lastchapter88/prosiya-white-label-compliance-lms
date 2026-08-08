<script lang="ts">
	import { Sidebar, Badge, Button, Modal } from '$lib/components';
	import { onMount } from 'svelte';
	import { evidenceService } from '$lib/services/evidence';
	import { auth } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';

	let evidenceList: any[] = [];
	let isLoading = true;
	let error: string | null = null;
	let selectedEvidence: any = null;
	let showVerifyModal = false;
	let verificationNotes = '';
	let isSubmitting = false;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			window.location.href = '/login';
			return;
		}
		await loadEvidence();
	});

	async function loadEvidence() {
		isLoading = true;
		try {
			const data = await evidenceService.getEvidenceList();
			evidenceList = data.results || data;
		} catch (e: any) {
			error = e.message || "Failed to load evidence submissions";
		} finally {
			isLoading = false;
		}
	}

	function openVerification(evidence: any) {
		selectedEvidence = evidence;
		verificationNotes = '';
		showVerifyModal = true;
	}

	async function confirmVerification() {
		isSubmitting = true;
		try {
			await evidenceService.verifyEvidence(selectedEvidence.id, verificationNotes);
			showVerifyModal = false;
			await loadEvidence(); // Refresh list
		} catch (e: any) {
			alert(e.message || "Verification failed");
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Instructor Verification - ProSiya LMS</title>
</svelte:head>

<div class="dashboard-layout">
	<Sidebar 
		userRole={$auth.user?.role as any || 'instructor'}
		userName="{$auth.user?.first_name} {$auth.user?.last_name}"
		userAvatar={$auth.user?.avatar || '/images/instructors/instructor-1.png'}
	/>
	
	<main class="dashboard-main">
		<div class="dashboard-header">
			<div>
				<h1>Evidence Verification Stack 👋</h1>
				<p class="subtitle">Review and verify student firearm competency evidence</p>
			</div>
			<div class="header-actions">
				<Button variant="outline" on:click={loadEvidence}>Refresh List</Button>
			</div>
		</div>

		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Fetching pending submissions...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<p>Error: {error}</p>
			</div>
		{:else}
			<div class="evidence-grid">
				{#each evidenceList as item}
					<div class="evidence-card" in:fade>
						<div class="card-header">
							<Badge variant={item.is_verified ? 'success' : 'warning'}>
								{item.is_verified ? 'Verified' : 'Pending Review'}
							</Badge>
							<span class="date">{new Date(item.session_date).toLocaleDateString()}</span>
						</div>
						
						<div class="card-body">
							<h3>{item.firearm_type} - {item.exercise_name}</h3>
							<p class="student-info">👤 Student ID: {item.student}</p>
							<div class="stats-row">
								<div class="stat">
									<span class="label">Total Shots</span>
									<span class="value">{item.total_shots}</span>
								</div>
								<div class="stat">
									<span class="label">Target Hits</span>
									<span class="value">{item.target_hits}</span>
								</div>
								<div class="stat">
									<span class="label">Score</span>
									<span class="value">{item.total_score}</span>
								</div>
							</div>
						</div>
						
						<div class="card-footer">
							{#if !item.is_verified}
								<Button variant="accent" className="w-full" on:click={() => openVerification(item)}>
									Review Evidence
								</Button>
							{:else}
								<Button variant="navy" className="w-full" disabled>Verified</Button>
							{/if}
						</div>
					</div>
				{:else}
					<div class="empty-state">
						<div class="icon">🎯</div>
						<h3>No pending evidence</h3>
						<p>All student submissions have been processed.</p>
					</div>
				{/each}
			</div>
		{/if}
	</main>

	<Modal 
		show={showVerifyModal} 
		title="Verify Firearm Evidence" 
		on:close={() => showVerifyModal = false}
		maxWidth="800px"
	>
		{#if selectedEvidence}
			<div class="verification-review">
				<div class="review-grid">
					<div class="evidence-details">
						<h4>Submission Details</h4>
						<ul>
							<li><strong>Exercise:</strong> {selectedEvidence.exercise_name}</li>
							<li><strong>Firearm:</strong> {selectedEvidence.firearm_type} ({selectedEvidence.firearm_serial})</li>
							<li><strong>Location:</strong> {selectedEvidence.range_location}</li>
							<li><strong>Date:</strong> {selectedEvidence.session_date}</li>
						</ul>
						
						<h4 class="mt-3">Ammunition & Performance</h4>
						<ul>
							<li><strong>Caliber:</strong> {selectedEvidence.ammunition_caliber}</li>
							<li><strong>Shots Fired:</strong> {selectedEvidence.total_shots}</li>
							<li><strong>Hits recorded:</strong> {selectedEvidence.target_hits}</li>
						</ul>
					</div>
					
					<div class="evidence-files">
						<h4>Attached Files</h4>
						<div class="files-placeholder">
							<div class="icon">📁</div>
							<p>View photo/video evidence links would appear here</p>
							<!-- In a real app, listing files from selectedEvidence.files -->
						</div>
					</div>
				</div>

				<div class="verification-form mt-4">
					<label for="notes">Instructor Notes / Compliance Comments</label>
					<textarea 
						id="notes" 
						bind:value={verificationNotes} 
						placeholder="Add any specific observations about the student's technique or compliance..."
						rows="4"
					></textarea>
					
					<div class="compliance-check mt-2">
                        <Badge variant="navy">Compliance Checksum: {selectedEvidence.evidence_hash.substring(0, 16)}...</Badge>
                        <p class="text-xs text-gray mt-1">This evidence is cryptographically signed and immutable.</p>
                    </div>
				</div>
			</div>
		{/if}

		<div slot="footer">
			<Button variant="outline" on:click={() => showVerifyModal = false}>Cancel</Button>
			<Button variant="success" on:click={confirmVerification} disabled={isSubmitting}>
				{isSubmitting ? 'Verifying...' : 'Verify & Sign'}
			</Button>
		</div>
	</Modal>
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

	.subtitle {
		color: var(--color-text-secondary);
	}

	.evidence-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
	}

	.evidence-card {
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-border);
		transition: transform 0.2s ease;
	}

	.evidence-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
	}

	.card-header {
		padding: 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--color-bg-light);
		border-bottom: 1px solid var(--color-border);
	}

	.date {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		font-weight: 600;
	}

	.card-body {
		padding: 1.5rem;
		flex: 1;
	}

	.card-body h3 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		color: var(--color-navy-dark);
	}

	.student-info {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.stat .label {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--color-text-secondary);
		font-weight: 700;
	}

	.stat .value {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-navy-dark);
	}

	.card-footer {
		padding: 1.25rem;
		border-top: 1px solid var(--color-border);
	}

	/* Modal styles */
	.review-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.evidence-details h4, .evidence-files h4 {
		font-size: 1rem;
		margin-bottom: 1rem;
		color: var(--color-navy-dark);
		border-bottom: 2px solid var(--color-accent);
		display: inline-block;
	}

	.evidence-details ul {
		list-style: none;
		padding: 0;
	}

	.evidence-details li {
		margin-bottom: 0.5rem;
		font-size: 0.95rem;
	}

	.files-placeholder {
		background: var(--color-bg-light);
		padding: 2rem;
		border-radius: var(--radius-md);
		text-align: center;
		border: 2px dashed var(--color-border);
	}

	.verification-form label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.verification-form textarea {
		width: 100%;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 1rem;
	}

	/* Loading/Empty */
	.loading-container, .empty-state {
		text-align: center;
		padding: 5rem;
		background: white;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
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
		.review-grid { grid-template-columns: 1fr; }
	}
</style>
