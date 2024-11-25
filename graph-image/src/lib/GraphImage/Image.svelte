<script lang="ts">
	import { createBubbler, handlers } from 'svelte/legacy';
	import type { Fit, Load, Watermark } from './types.js';
	import type {HTMLImgAttributes} from 'svelte/elements'
	import { createFinalURL } from './_utils.js';

	interface Props extends Omit<HTMLImgAttributes, 'src' | 'srcset' | 'sizes'> {
		handle: string;
		title?: string | undefined;
		opacity?: 0 | 1;
		transitionDelay?: string;
		transition?: string;
		center?: boolean;
		baseURI?: string;
		media?: string | undefined;
		// --- Styling and Presentation ---
		fit?: Fit;
		maxWidth?: number | undefined;
		maxHeight?: number | undefined;
		load?: Load;
		absolute?: boolean;
		// --- Image Enhancements and Effects ---
		quality?: number | undefined;
		rotate?: number | undefined;
		sharpen?: number | undefined;
		blur?: number | undefined;
		withWebp?: boolean;
		// --- Miscellaneous Features ---
		watermark?: Watermark | undefined;
	}

	let {
		handle,
		alt,
		height,
		width,
		title = undefined,
		opacity = $bindable(0),
		transitionDelay = '0.25s',
		transition = 'opacity 0.5s',
		center = false,
		baseURI = 'https://media.graphassets.com',
		media = undefined,
		fit = 'crop',
		maxWidth = undefined,
		maxHeight = undefined,
		load = 'lazy',
		absolute = false,
		quality = undefined,
		rotate = undefined,
		sharpen = undefined,
		blur = undefined,
		withWebp = true,
		watermark = undefined,
		...rest
	}: Props = $props();

	function handleLoading(e: { target: HTMLImageElement } & Event) {
		if (e.target.complete) opacity = 1;
	}

	let style = $derived(`max-width: ${width}px; max-height: ${height}px; ${
		load === 'eager'
			? ''
			: `transition: ${transition}; transition-delay: ${transitionDelay}; opacity:
					 1 
			  ;`
	} ${center ? `aspect-ratio: ${width} / ${height}; object-fit: contain !important;` : ``}`);

	let { sizes, srcset, src } = $derived(createFinalURL(
		{ width, height: maxHeight ?? height, handle },
		withWebp,
		baseURI,
		maxWidth ?? width,
		fit,
		quality,
		sharpen,
		rotate,
		blur,
		watermark
	));
</script>

<svelte:head>
	{#if load === 'eager'}
		<link rel="preload" as="image" href={src} imagesrcset={srcset} imagesizes={sizes} {media} />
	{/if}
</svelte:head>

<img
	{...rest}
	{src}
	{srcset}
	{sizes}
	{style}
	{title}
	class:absolute
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
