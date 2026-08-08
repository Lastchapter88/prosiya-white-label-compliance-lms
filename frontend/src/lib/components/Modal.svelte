<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let show = false;
	export let title = '';
	export let maxWidth = '600px';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (show && event.key === 'Escape') {
			close();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if show}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div 
		class="modal-backdrop" 
		on:click|self={close}
		on:keydown|self={(e) => e.key === 'Enter' && close()}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
	>
		<div 
			class="modal-content" 
			style="max-width: {maxWidth}"
			transition:scale={{ duration: 300, start: 0.95 }}
		>
			<div class="modal-header">
				<h3>{title}</h3>
				<button class="close-btn" on:click={close}>&times;</button>
			</div>
			
			<div class="modal-body">
				<slot />
			</div>

			{#if $$slots.footer}
				<div class="modal-footer">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-md);
	}

	.modal-content {
		background: var(--color-surface);
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-modal);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.modal-header h3 {
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--color-text-secondary);
		padding: 0 0.5rem;
	}

	.modal-body {
		padding: var(--spacing-lg);
		max-height: 80vh;
		overflow-y: auto;
	}

	.modal-footer {
		padding: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-md);
		background: var(--color-bg-light);
	}
</style>
