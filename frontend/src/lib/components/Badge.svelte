<script lang="ts">
	export let variant: "default" | "success" | "warning" | "error" | "accent" | "navy" | "live" = "default";
	export let size: "sm" | "md" = "md";
	export let className: string = "";

	const variantClasses = {
		default: "bg-light text-navy",
		success: "bg-success text-white",
		warning: "bg-warning text-white",
		error: "bg-error text-white",
		accent: "bg-accent text-navy",
		navy: "bg-navy-dark text-white",
		live: "live-badge"
	};

	const sizeClasses = {
		sm: "text-xs p-xs",
		md: "text-sm p-sm"
	};
</script>

<span class="badge {variant === 'live' ? '' : variantClasses[variant]} {sizeClasses[size]} {className}">
	<slot />
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		border-radius: var(--radius-full);
		font-weight: 600;
		white-space: nowrap;
	}

	.bg-light { background-color: var(--color-bg-light); }
	.bg-success { background-color: var(--color-success); }
	.bg-warning { background-color: var(--color-warning); }
	.bg-error { background-color: var(--color-error); }
	.bg-accent { background-color: var(--color-accent); }
	.bg-navy-dark { background-color: var(--color-navy-dark); }
	
	.text-white { color: white; }
	.text-navy { color: var(--color-navy-dark); }

	.text-xs { font-size: 0.75rem; }
	.text-sm { font-size: 0.875rem; }

	.p-xs { padding: 0.125rem 0.5rem; }
	.p-sm { padding: 0.25rem 0.75rem; }
</style>
