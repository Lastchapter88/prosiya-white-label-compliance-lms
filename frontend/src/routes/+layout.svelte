<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initAutoTheme } from '$lib/theme';
	import { ChatWidget } from '$lib/components';

	let { children } = $props();

	onMount(() => {
		const stop = initAutoTheme();
		return stop;
	});
</script>

<div class="app">
	{@render children()}
	<ChatWidget />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
