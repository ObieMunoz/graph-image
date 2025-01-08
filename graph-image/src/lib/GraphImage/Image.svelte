<script lang="ts">
	import type { ImageProps } from './types.js';
	import { createFinalURL } from './_utils.js';

	let {
		handle,
		height,
		maxHeight,
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
	}: ImageProps = $props();

	let styleObj = $derived.by(() => {
		if (layout === 'constrained') {
			return [
				['object-fit', 'contain'],
				['aspect-ratio', `${width} / ${height}`],
				['max-width', `${width}px`],
				['max-height', `${maxHeight || height}px`],
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

	let style = $derived(styleObj.map((val) => val.join(':')).join(';') + ';' + rest.style || '');

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
		transition: var(--graph-image-transition, opacity 0.1s 0.25s);
		@starting-style {
			opacity: 0;
		}
	}

	@media (user-preference: reduced-motion) {
		img[loading='lazy'] {
			transition: none;
		}
	}
</style>
