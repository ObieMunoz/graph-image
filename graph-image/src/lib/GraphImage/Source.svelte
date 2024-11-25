<script lang="ts">
	import type { Fit, Watermark } from './types.js';
	import { createFinalURL } from './_utils.js';


	

	
	interface Props {
		handle: string;
		height: number;
		width: number;
		media: string;
		preloadMedia?: string | undefined;
		maxWidth?: number | undefined;
		baseURI?: string;
		// --- Styling and Presentation ---
		fit?: Fit;
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
		height,
		width,
		media,
		preloadMedia = undefined,
		maxWidth = undefined,
		baseURI = 'https://media.graphassets.com',
		fit = 'crop',
		quality = undefined,
		rotate = undefined,
		sharpen = undefined,
		blur = undefined,
		withWebp = true,
		watermark = undefined
	}: Props = $props();

	let { sizes, srcset, src } = $derived(createFinalURL(
		{ width, height, handle },
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
	{#if preloadMedia}
		<link
			rel="preload"
			as="image"
			href={src}
			imagesrcset={srcset}
			imagesizes={sizes}
			media={preloadMedia}
		/>
	{/if}
</svelte:head>

<source {src} {srcset} {sizes} {media} />
