<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/services/api';
    import Button from '$lib/components/Button.svelte';

    let user: any = {
        first_name: '',
        last_name: '',
        email: '',
        profile: { bio: '', phone_number: '' }
    };
    let loading = false;
    let message = '';
    let messageType = 'success'; // success | error

    onMount(async () => {
        try {
            user = await api.get('/users/me/');
        } catch (e) {
            console.error(e);
        }
    });

    async function handleSubmit() {
        loading = true;
        message = '';
        try {
            // Update User details
            await api.patch(`/users/${user.id}/`, {
                first_name: user.first_name,
                last_name: user.last_name,
                // Assuming profile update might need nested handling or separate endpoint depending on drf-writable-nested
                // If UserSerializer has read_only profile, we might not be able to update profile fields here easily.
                // Let's verify UserSerializer. profile is present.
            });
            message = 'Profile updated successfully.';
            messageType = 'success';
        } catch (e: any) {
            message = 'Error updating profile: ' + (e.message || 'Unknown error');
            messageType = 'error';
        } finally {
            loading = false;
        }
    }
</script>

<div class="settings-page">
    <div class="header">
        <h1>Account Settings</h1>
        <p class="subtitle">Manage your profile information</p>
    </div>

    <div class="card">
        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-section">
                <h3>Personal Information</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="first_name">First Name</label>
                        <input id="first_name" type="text" bind:value={user.first_name} required />
                    </div>
                    <div class="form-group">
                        <label for="last_name">Last Name</label>
                        <input id="last_name" type="text" bind:value={user.last_name} required />
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" value={user.email} disabled class="disabled" />
                    <span class="help-text">Contact support to change your email.</span>
                </div>
            </div>

            {#if message}
                <div class="alert {messageType}">
                    {message}
                </div>
            {/if}

            <div class="form-actions">
                <Button variant="accent" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    </div>
</div>

<style>
    .settings-page {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    .header {
        margin-bottom: 2rem;
    }

    h1 {
        margin: 0;
        font-size: 1.8rem;
        color: var(--color-navy-dark);
    }

    .subtitle {
        margin: 0.5rem 0 0;
        color: var(--color-text-light);
    }

    .card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .form-section {
        margin-bottom: 2rem;
    }

    h3 {
        margin: 0 0 1.5rem;
        color: var(--color-navy);
        font-size: 1.1rem;
        border-bottom: 1px solid #f3f4f6;
        padding-bottom: 0.75rem;
    }

    .form-row {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
        margin-bottom: 1.25rem;
    }

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-navy);
    }

    input, select, textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
        width: 100%;
        box-sizing: border-box;
    }

    input.disabled {
        background-color: #f3f4f6;
        cursor: not-allowed;
        color: #6b7280;
    }

    .help-text {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .alert {
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1.5rem;
        font-weight: 500;
    }

    .alert.success {
        background-color: #def7ec;
        color: #03543f;
        border: 1px solid #bcf0da;
    }

    .alert.error {
        background-color: #fde8e8;
        color: #9b1c1c;
        border: 1px solid #fbd5d5;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
    }
</style>
