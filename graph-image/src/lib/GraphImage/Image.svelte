<script lang="ts">
	import type { Fit, Load, Watermark } from './types.js';
	import { createFinalURL } from './_utils.js';

	export let handle: string;
	export let alt: string;
	export let height: number;
	export let width: number;
	export let title: string | undefined = undefined;
	export let opacity: 0 | 1 = 0;
	export let transitionDelay: string = '0.25s';
	export let transition: string = 'opacity 0.5s';
	export let center: boolean = false;
	export let baseURI: string = 'https://media.graphassets.com';
	export let media: string | undefined = undefined;
	export let id: string | undefined = undefined;

	// --- Styling and Presentation ---
	export let fit: Fit = 'crop';
	export let maxWidth: number | undefined = undefined;
	export let load: Load = 'lazy';
	export let absolute = false;

	// --- Image Enhancements and Effects ---
	export let quality: number | undefined = undefined;
	export let rotate: number | undefined = undefined;
	export let sharpen: number | undefined = undefined;
	export let withWebp: boolean = true;
	// --- Miscellaneous Features ---
	export let watermark: Watermark | undefined = undefined;

	function handleLoading(e: { target: HTMLImageElement } & Event) {
		if (e.target.complete) opacity = 1;
	}

	$: style = `max-width: ${width}px; max-height: ${height}px; ${
		load === 'eager'
			? ''
			: `transition: ${transition}; transition-delay: ${transitionDelay}; opacity:
					 1 
			  ;`
	} ${center ? `aspect-ratio: ${width} / ${height}; object-fit: contain !important;` : ``}`;

	$: ({ sizes, srcset, src } = createFinalURL(
		{ width, height, handle },
		withWebp,
		baseURI,
		maxWidth ?? width,
		fit,
		quality,
		sharpen,
		rotate,
		watermark
	));
</script>

<svelte:head>
	{#if load === 'eager'}
		<link rel="preload" as="image" href={src} imagesrcset={srcset} imagesizes={sizes} {media} />
	{/if}
</svelte:head>

<img
	{id}
	{src}
	{srcset}
	{sizes}
	{alt}
	{style}
	{title}
	class:absolute
	on:load={handleLoading}
	on:load
	on:error
/>

<style>
	img {
		width: 100%;
		object-fit: cover;
		object-position: center;
	}

	.absolute {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
