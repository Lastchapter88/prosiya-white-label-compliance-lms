<script lang="ts">
	export let value = 0;
	export let size = 56;
	export let stroke = 6;
	export let label = '';

	$: clamped = Math.max(0, Math.min(100, value));
	$: radius = (size - stroke) / 2;
	$: circumference = 2 * Math.PI * radius;
	$: offset = circumference - (clamped / 100) * circumference;
</script>

<div class="ring" style="width:{size}px;height:{size}px" aria-label={label || `${clamped}% complete`}>
	<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
		<circle
			class="track"
			cx={size / 2}
			cy={size / 2}
			r={radius}
			stroke-width={stroke}
			fill="none"
		/>
		<circle
			class="value"
			cx={size / 2}
			cy={size / 2}
			r={radius}
			stroke-width={stroke}
			fill="none"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			stroke-linecap="round"
			transform="rotate(-90 {size / 2} {size / 2})"
		/>
	</svg>
	<span>{Math.round(clamped)}%</span>
</div>

<style>
	.ring {
		position: relative;
		flex-shrink: 0;
	}

	svg {
		display: block;
	}

	.track {
		stroke: color-mix(in srgb, var(--color-border) 80%, var(--color-accent) 20%);
	}

	.value {
		stroke: var(--color-accent);
		transition: stroke-dashoffset 0.4s ease;
	}

	span {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 0.72rem;
		font-weight: 800;
		color: var(--color-navy-dark);
	}
</style>
