<script lang="ts">
	export let type: "button" | "submit" | "reset" = "button";
	export let variant: "primary" | "secondary" | "accent" | "navy" | "outline" | "error" | "success" | "warning" = "primary";
	export let size: "sm" | "md" | "lg" = "md";
	export let disabled: boolean = false;
	export let className: string = "";
	export let href: string | undefined = undefined;

	const variantClasses = {
		primary: "btn-primary",
		secondary: "btn-secondary",
		accent: "btn-accent",
		navy: "btn-navy",
		outline: "btn-outline",
		error: "btn-error",
		success: "btn-success",
		warning: "btn-warning"
	};

	const sizeClasses = {
		sm: "p-1 text-sm",
		md: "p-2",
		lg: "p-3 text-lg"
	};
</script>

{#if href}
	<a {href} class="btn {variantClasses[variant]} {sizeClasses[size]} {className}" on:click>
		<slot />
	</a>
{:else}
	<button {type} {disabled} class="btn {variantClasses[variant]} {sizeClasses[size]} {className}" on:click>
		<slot />
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition: all 0.2s ease;
		text-decoration: none;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}

	.p-1 { padding: 0.25rem 0.75rem; }
	.p-2 { padding: 0.5rem 1.25rem; }
	.p-3 { padding: 0.75rem 2rem; }

	.text-sm { font-size: 0.875rem; }
	.text-lg { font-size: 1.125rem; }
</style>
