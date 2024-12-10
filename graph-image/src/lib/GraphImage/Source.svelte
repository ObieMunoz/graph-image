<script lang="ts">
	import type { Fit, Watermark } from './types.js';
	import type { HTMLSourceAttributes } from 'svelte/elements';
	import { createFinalURL } from './_utils.js';

	interface Props extends Omit<HTMLSourceAttributes, 'src' | 'srcset'> {
		handle: string;
		title?: string | undefined;
		width: number;
		preloadMedia?: string;
		baseURI?: string;
		// --- Styling and Presentation ---
		fit?: Fit;
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
		width,
		sizes,
		preloadMedia = undefined,
		media = undefined,
		baseURI = 'https://media.graphassets.com',
		fit = 'crop',
		quality = undefined,
		rotate = undefined,
		sharpen = undefined,
		blur = undefined,
		withWebp = true,
		watermark = undefined,
		...rest
	}: Props = $props();

	let { srcset, src } = $derived(
		createFinalURL(handle, width, fit, sizes, withWebp, baseURI, {
			quality,
			sharpen,
			rotate,
			blur,
			watermark
		})
	);
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

<source {...rest} {src} {srcset} {sizes} {media} />
