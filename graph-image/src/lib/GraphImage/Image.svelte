<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Load } from './types.js';

	const dispatch = createEventDispatcher();
	export let src: string;
	export let alt: string;
	export let height: number;
	export let width: number;
	export let srcset: string | undefined = undefined;
	export let sizes: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let opacity: 0 | 1 = 0;
	export let transitionDelay: string = '0.25s';
	export let transition: string = 'opacity 0.5s';
	export let load: Load = 'lazy';
	export let thumb: boolean = false;

	let id = crypto.randomUUID().slice(0, 8);

	function handleLoading(e: Event) {
		if (!(e.target instanceof HTMLImageElement)) return;

		if (e.target.complete) opacity = 1;

		dispatch('imageLoad');
	}

	$: style = `max-width: ${width}px; max-height: ${height}px; ${
		load === 'eager'
			? ''
			: `transition: ${transition}; transition-delay: ${transitionDelay}; opacity: ${thumb ? 1 : opacity};`
	}`;
</script>

<svelte:head>
	{#if load === 'eager'}
		<link rel="preload" as="image" href={src} imagesrcset={srcset} imagesizes={sizes} />
	{/if}
</svelte:head>

<img {id} {src} {srcset} {sizes} {alt} {style} {title} on:load={handleLoading} />

<style>
	img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>
