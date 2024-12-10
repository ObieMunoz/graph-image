<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	inject({ mode: dev ? 'development' : 'production' });
</script>

<main>
	<div>
		{@render children?.()}
	</div>
</main>

<style>
	main {
		background-color: #1e1e1e;
		color: #f0f0f0;
		font-family: 'Arial', sans-serif;
	}
	div {
		margin: 0 auto;
		padding: 1rem;
		max-width: 1200px;
	}
</style>
