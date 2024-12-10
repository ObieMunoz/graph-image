<script lang="ts">
	import type { Fit, Load, Watermark } from './types.js';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { createFinalURL } from './_utils.js';
	interface Props extends Omit<HTMLImgAttributes, 'src' | 'srcset'> {
		handle: string;
		title?: string;
		width: number;
		baseURI?: string;
		/** @description determines how the images is scaled
		 *  @default 'constrained'
		 */
		layout?: 'fullWidth' | 'constrained' | 'fixed';
		// --- Styling and Presentation ---
		fit?: Fit;
		maxWidth?: number;
		maxHeight?: number;
		load?: Load;
		absolute?: boolean;
		// --- Image Enhancements and Effects ---
		quality?: number;
		rotate?: number;
		sharpen?: number;
		blur?: number;
		withWebp?: boolean;
		media?: string | null;
		// --- Miscellaneous Features ---
		watermark?: Watermark;
	}

	let {
		handle,
		height,
		width,
		sizes,
		layout = 'constrained',
		loading = 'lazy',
		baseURI = 'https://media.graphassets.com',
		fit = 'crop',
		absolute = false,
		quality = undefined,
		rotate = undefined,
		sharpen = undefined,
		blur = undefined,
		withWebp = true,
		watermark = undefined,
		media,
		...rest
	}: Props = $props();

	let styleObj = $derived.by(() => {
		if (layout === 'constrained') {
			return [
				['object-fit', 'cover'],
				['aspect-ratio', `${width} / ${height}`],
				['max-width', `${width}px`],
				['max-height', `${height}px`],
				['width', '100%']
			];
		}
		if (layout === 'fullWidth') {
			return [
				['object-fit', 'cover'],
				['aspect-ratio', `${width} / ${height}`],
				['width', '100%']
			];
		}
		return [
			['width', `${width}px`],
			['height', `${height}px`]
		];
	});

	let style = $derived(styleObj.map((val) => val.join(':')).join(';') + rest.style);

	// handle sizes attribute with resonable default if not provided
	let calculatedSizes = $derived.by(() => {
		if (sizes) return sizes;
		if (layout === 'constrained') return `(min-width: ${width}px) ${width}px, 100vw`;
		if (layout === 'fullWidth') return '100vw';
		return `${width}px`;
	});

	let { srcset, src } = $derived(
		createFinalURL(handle, width, fit, calculatedSizes, withWebp, baseURI, {
			quality,
			sharpen,
			rotate,
			blur,
			watermark
		})
	);
</script>

<svelte:head>
	{#if loading === 'eager'}
		<link
			rel="preload"
			as="image"
			href={src}
			imagesrcset={srcset}
			imagesizes={calculatedSizes}
			{media}
		/>
	{/if}
</svelte:head>

<img
	{...rest}
	{src}
	{srcset}
	{style}
	{loading}
	sizes={calculatedSizes}
	fetchpriority={loading === 'eager' ? 'high' : 'auto'}
	decoding={loading === 'lazy' ? 'async' : undefined}
	class:absolute
/>

<style>
	.absolute {
		position: absolute;
		top: 0;
		left: 0;
	}
	img[loading='lazy'] {
		transition: var(--graph-image-transition, opacity 0.25s 0.5s);
		@starting-style {
			opacity: 0;
		}
	}
</style>
