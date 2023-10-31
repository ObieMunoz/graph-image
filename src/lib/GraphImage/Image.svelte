<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { createLoadObserver } from './_utils.js';

	const dispatch = createEventDispatcher();
	export let src: string;
	export let alt: string;
	export let opacity: 0 | 1 = 0;
	export let transitionDelay: string = '0.25s';
	export let transition: string = 'opacity 0.5s';
	export let load = 'lazy';

	let id = crypto.randomUUID().slice(0, 8);

	const onload = createLoadObserver(() => {
		opacity = 1;
		dispatch('imageLoad');
	});
</script>

<svelte:head>
	{#if load === 'eager'}
		<link rel="preload" as="image" href={src} imagesrcset={$$props?.srcset} imagesizes={$$props?.sizes} />
	{/if}
</svelte:head>

<img
	use:onload
	on:load
	{...$$props}
	{id}
	{src}
	{alt}
	style={load === 'eager' ? '' : `transition: ${transition}; transition-delay: ${transitionDelay}; opacity: ${opacity};`}
/>

<style>
	img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>
