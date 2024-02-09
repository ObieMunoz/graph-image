<script lang="ts">
	import type { Fit, Watermark } from './types.js';
	import { createFinalURL } from './_utils.js';

	export let handle: string;
	export let height: number;
	export let width: number;
	export let media: string;
	export let preloadMedia: string | undefined = undefined;
	export let maxWidth: number | undefined = undefined;
	export let baseURI: string = 'https://media.graphassets.com';

	// --- Styling and Presentation ---
	export let fit: Fit = 'crop';

	export let quality: number | undefined = undefined;
	export let rotate: number | undefined = undefined;
	export let sharpen: number | undefined = undefined;
	export let blur: number | undefined = undefined;
	export let withWebp: boolean = true;
	// --- Miscellaneous Features ---
	export let watermark: Watermark | undefined = undefined;

	$: ({ sizes, srcset, src } = createFinalURL(
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
