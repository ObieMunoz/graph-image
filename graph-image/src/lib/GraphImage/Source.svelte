<script lang="ts">
	import type { Fit } from './types.js';
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
	export let withWebp: boolean = true;

	$: ({ sizes, srcset, src } = createFinalURL(
		{ width, height, handle },
		withWebp,
		baseURI,
		maxWidth ?? width,
		fit,
		quality,
		sharpen,
		rotate
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
