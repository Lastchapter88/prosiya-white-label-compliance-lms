<script lang="ts">
    import { onMount } from 'svelte';
    import { userService } from '$lib/services/users';
    import Button from '$lib/components/Button.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import Badge from '$lib/components/Badge.svelte';

    let users: any[] = [];
    let showModal = false;
    let isEditing = false;
    let loading = false;

    let formData = {
        id: 0,
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
        is_active: true
    };

    onMount(async () => {
        await loadUsers();
    });

    async function loadUsers() {
        try {
            const response = await userService.getUsers();
            if (response.results) {
                users = response.results;
            } else if (Array.isArray(response)) {
                users = response;
            } else {
                users = [];
            }
        } catch (e) {
            console.error('Failed to load users', e);
        }
    }

    function openCreate() {
        formData = {
            id: 0,
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            role: 'student',
            is_active: true
        };
        isEditing = false;
        showModal = true;
    }

    function openEdit(user: any) {
        formData = { ...user, password: '' }; // Don't show hash, empty means no change
        isEditing = true;
        showModal = true;
    }

    async function handleSubmit() {
        loading = true;
        try {
            const data = { ...formData };
            if (data.password === '') {
                delete data.password;
            }

            if (isEditing) {
                await userService.updateUser(data.id, data);
            } else {
                await userService.createUser(data);
            }
            showModal = false;
            await loadUsers();
        } catch (e: any) {
            alert('Error saving user: ' + (e.message || 'Unknown error'));
        } finally {
            loading = false;
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.deleteUser(id);
            await loadUsers();
        } catch (e) {
            alert('Error deleting user');
        }
    }
</script>

<div class="admin-page">
    <div class="header-actions">
        <div>
            <h1>User Management</h1>
            <p class="subtitle">Manage students, instructors, and administrators</p>
        </div>
        <Button variant="accent" on:click={openCreate}>+ Add User</Button>
    </div>

    <div class="user-list-container">
        {#if users.length === 0}
            <div class="empty-state">
                <p>No users found.</p>
            </div>
        {:else}
            <table class="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar-placeholder">
                                        {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'N'}
                                    </div>
                                    <div class="user-info">
                                        <div class="font-medium">{user.first_name} {user.last_name}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="role-badge role-{user.role}">{user.role}</span>
                            </td>
                            <td>
                                <Badge variant={user.is_active ? 'success' : 'error'}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </td>
                            <td>{user.email}</td>
                            <td class="text-right">
                                <button class="action-btn edit" on:click={() => openEdit(user)}>Edit</button>
                                <button class="action-btn delete" on:click={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>

    <Modal bind:isOpen={showModal} title={isEditing ? 'Edit User' : 'Add New User'}>
        <form on:submit|preventDefault={handleSubmit} class="user-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input id="first_name" type="text" bind:value={formData.first_name} required />
                </div>
                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input id="last_name" type="text" bind:value={formData.last_name} required />
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input id="email" type="email" bind:value={formData.email} required disabled={isEditing && false /* Allow email edit for now */} />
            </div>

            <div class="form-group">
                <label for="password">Password {isEditing ? '(Leave blank to keep current)' : ''}</label>
                <input id="password" type="password" bind:value={formData.password} required={!isEditing} />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" bind:value={formData.role}>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                        <option value="assessor">Assessor</option>
                        <option value="moderator">Moderator</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" bind:value={formData.is_active}>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <Button variant="primary" type="button" on:click={() => showModal = false}>Cancel</Button>
                <Button variant="accent" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
                </Button>
            </div>
        </form>
    </Modal>
</div>

<style>
    .admin-page {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

    th, td {
        padding: 1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid #f3f4f6;
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

    .role-student { background: #e0f2fe; color: #0369a1; }
    .role-instructor { background: #fef3c7; color: #d97706; }
    .role-admin { background: #e1effe; color: #1e40af; border: 1px solid #bfdbfe; }

    .text-right {
        text-align: right;
    }

    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.15s;
    }

    .action-btn.edit { color: var(--color-navy); }
    .action-btn.edit:hover { color: var(--color-accent); }
    .action-btn.delete { color: #ef4444; margin-left: 0.5rem; }
    .action-btn.delete:hover { color: #dc2626; }

    .empty-state {
        padding: 3rem;
        text-align: center;
        color: var(--color-text-light);
    }

    .user-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 0.5rem;
    }

    .form-row {
        display: flex;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-navy);
    }

    input, select {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.95rem;
        width: 100%;
        box-sizing: border-box;
    }

    input:focus, select:focus {
        outline: none;
        border-color: var(--color-navy);
        box-shadow: 0 0 0 2px rgba(26, 35, 50, 0.1);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f3f4f6;
    }

    @media (max-width: 640px) {
        .form-row { flex-direction: column; }
    }
</style>
