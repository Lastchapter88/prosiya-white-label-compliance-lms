<script lang="ts">
	import { Sidebar, Badge, Button, Modal } from '$lib/components';
	import { onMount } from 'svelte';
	import { certificateService } from '$lib/services/compliance';
	import { auth } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';

	let certificates: any[] = [];
	let isLoading = true;
	let error: string | null = null;
    let showIssueModal = false;
    let isSubmitting = false;

    // Form for new certificate
    let newCert = {
        student: '',
        course: '',
        template: '',
        expiry_date: ''
    };

	onMount(async () => {
		await loadCertificates();
	});

	async function loadCertificates() {
		isLoading = true;
		try {
			const data = await certificateService.getCertificates();
			certificates = data.results || data;
		} catch (e: any) {
			error = e.message || "Failed to load certificates";
		} finally {
			isLoading = false;
		}
	}

    async function handleIssue() {
        isSubmitting = true;
        try {
            await certificateService.issueCertificate(newCert);
            showIssueModal = false;
            await loadCertificates();
        } catch (e: any) {
            alert(e.message || "Failed to issue certificate");
        } finally {
            isSubmitting = false;
        }
    }

    async function handleRevoke(id: string) {
        if (!confirm("Are you sure you want to revoke this certificate? This action is immutable and will be logged.")) return;
        
        try {
            await certificateService.revokeCertificate(id, "Administrative Revocation");
            await loadCertificates();
        } catch (e: any) {
            alert(e.message || "Revocation failed");
        }
    }
</script>

<svelte:head>
	<title>Certificate Management - ProSiya Compliance</title>
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
				<h1>Certificates & Credentials 🎓</h1>
				<p class="subtitle">Manage, issue, and verify student certifications</p>
			</div>
			<div class="header-actions">
				<Button variant="accent" on:click={() => showIssueModal = true}>Issue New Certificate</Button>
			</div>
		</div>

		{#if isLoading}
			<div class="loading-container">
				<div class="loader"></div>
				<p>Loading credential database...</p>
			</div>
		{:else if error}
			<div class="error-container">
				<p>Error: {error}</p>
			</div>
		{:else}
			<div class="certificates-list" in:fade>
				{#each certificates as cert}
					<div class="cert-card">
						<div class="cert-main">
							<div class="cert-icon">📜</div>
							<div class="cert-details">
								<h3>{cert.serial_number}</h3>
								<p class="cert-meta">Student: {cert.student} • Course: {cert.course}</p>
								<div class="dates">
									<span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
									{#if cert.expires_at}
										<span class="expiry">Expires: {new Date(cert.expires_at).toLocaleDateString()}</span>
									{/if}
								</div>
							</div>
						</div>
						<div class="cert-actions">
							<Badge variant={cert.is_revoked ? 'error' : 'success'}>
								{cert.is_revoked ? 'REVOKED' : 'VALID'}
							</Badge>
							<div class="btn-group">
								<Button variant="outline" size="sm">Download PDF</Button>
								{#if !cert.is_revoked}
									<Button variant="error" size="sm" on:click={() => handleRevoke(cert.id)}>Revoke</Button>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<div class="empty-state">
						<div class="icon">🎓</div>
						<h3>No certificates issued yet</h3>
						<p>Start by issuing a new credential to a student.</p>
					</div>
				{/each}
			</div>
		{/if}
	</main>

    <Modal show={showIssueModal} title="Issue Professional Certificate" on:close={() => showIssueModal = false}>
        <form on:submit|preventDefault={handleIssue} class="issue-form">
            <div class="form-group">
                <label for="student">Student ID / Email</label>
                <input type="text" id="student" bind:value={newCert.student} placeholder="Enter student identifier" required />
            </div>
            
            <div class="form-group">
                <label for="course">Course</label>
                <select id="course" bind:value={newCert.course} required>
                    <option value="">Select a course...</option>
                    <option value="grade-e">Grade E Security</option>
                    <option value="firearm-basic">Basic Firearm Comp.</option>
                </select>
            </div>

            <div class="form-group">
                <label for="template">Template</label>
                <select id="template" bind:value={newCert.template} required>
                    <option value="standard">Standard ProSiya Gray</option>
                    <option value="regulator">Official SASSETA Format</option>
                </select>
            </div>

            <div class="form-group">
                <label for="expiry">Expiry Date (Optional)</label>
                <input type="date" id="expiry" bind:value={newCert.expiry_date} />
            </div>

            <div class="compliance-note">
                <p>Note: This certificate will be assigned a unique serial number and cryptographically hashed for regulator verification.</p>
            </div>

            <div class="modal-footer-actions">
                <Button variant="outline" on:click={() => showIssueModal = false}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={isSubmitting}>
                    {isSubmitting ? 'Issuing...' : 'Issue Certificate'}
                </Button>
            </div>
        </form>
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

	.certificates-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.cert-card {
		background: white;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid var(--color-border);
	}

	.cert-main {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.cert-icon {
		font-size: 2.5rem;
		background: var(--color-bg-light);
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
	}

	.cert-details h3 {
		margin: 0;
		color: var(--color-navy-dark);
		font-family: var(--font-mono);
	}

	.cert-meta {
		color: var(--color-text-secondary);
		margin: 0.25rem 0;
		font-size: 0.9rem;
	}

	.dates {
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.expiry {
		color: var(--color-warning);
		font-weight: 600;
	}

	.cert-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1rem;
	}

	.btn-group {
		display: flex;
		gap: 0.5rem;
	}

    .issue-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--color-navy-dark);
    }

    .compliance-note {
        padding: 1rem;
        background: var(--color-bg-light);
        border-radius: var(--radius-md);
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        border-left: 4px solid var(--color-accent);
    }

    .modal-footer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
    }

	.loading-container, .empty-state {
		text-align: center;
		padding: 5rem;
		background: white;
		border-radius: var(--radius-lg);
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
		.cert-card { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
		.cert-actions { align-items: flex-start; width: 100%; }
		.btn-group { width: 100%; }
	}
</style>
