<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';

    // Reactive redirect if not authenticated and loading finished
    $: if (!$auth.loading && !$auth.isAuthenticated) {
        if (typeof window !== 'undefined') goto('/login');
    }

    // Admin role check
    $: if (!$auth.loading && $auth.isAuthenticated && $auth.user?.role !== 'admin') {
         // Redirect unauthorized users
         if (typeof window !== 'undefined') goto('/student/dashboard');
    }
</script>

{#if $auth.loading}
    <div class="loading-container">
        <div class="loader"></div>
        <p>Accessing admin console...</p>
    </div>
{:else if $auth.isAuthenticated && $auth.user?.role === 'admin'}
    <slot />
{/if}

<style>
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: #f8fafc;
        color: #64748b;
        font-family: inherit;
    }
    .loader {
        border: 4px solid #e2e8f0;
        border-top: 4px solid #dc2626; /* Red for admin/critical */
        border-radius: 50%;
        width: 48px;
        height: 48px;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
