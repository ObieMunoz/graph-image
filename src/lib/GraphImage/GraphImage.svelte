<script lang="ts">
	import Image from './Image.svelte';
	import { bgColor, createFinalURL, inImageCache, listenToIntersections } from './_utils.js';
	import type { Fit, ImageProps, Watermark } from './types.ts';

	export let image: ImageProps;
	export let maxWidth: number = 800;
	export let fadeIn: boolean = true;
	export let fit: Fit = 'crop';
	export let withWebp: boolean = true;
	export let title: string = '';
	export let alt: string = '';
	export let style: Record<string, any> = {};
	export let blurryPlaceholder: boolean = true;
	export let backgroundColor: string | boolean = '';
	export let baseURI: string = 'https://media.graphassets.com';
	export let quality: number | undefined = undefined;
	export let sharpen: number | undefined = undefined;
	export let rotate: number | undefined = undefined;
	export let watermark: Watermark | undefined = undefined;

	const seenBefore = inImageCache(image, false);
	// convert style Record<string, any> = {} to a style string
	const styleString = Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join('');
	const { finalSrc, sizes, srcSetImgs, thumbSrc } = createFinalURL(
		image,
		withWebp,
		baseURI,
		maxWidth,
		fit,
		quality,
		sharpen,
		rotate,
		watermark
	);

	let imageInnerWrapper: HTMLElement | null = null;
	let imgLoaded = false;
	let IOSupported = typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined';
	let isVisible = false;

	function onImageLoaded() {
		if (IOSupported) {
			imgLoaded = true;
			inImageCache(image, true);
		}
	}

	$: if (imageInnerWrapper && IOSupported) {
		listenToIntersections(imageInnerWrapper, () => {
			isVisible = true;
			imgLoaded = false;
		});
	}

	$: if (!seenBefore && IOSupported) {
		isVisible = false;
		imgLoaded = false;
	}
</script>

<div
	class="outer"
	class:initial={style.position === 'absolute'}
	class:relative={style.position !== 'absolute'}
>
	<div class="inner" style={styleString} bind:this={imageInnerWrapper}>
		<!-- Preserve the aspect ratio. -->
		<div class="full" style="padding-bottom: {100 / (image.width / image.height)}%" />

		{#if blurryPlaceholder}
			<Image
				{alt}
				{title}
				src={thumbSrc}
				style="opacity: {imgLoaded ? 0 : 1}; transition-delay: 0.25s"
			/>
		{/if}

		{#if backgroundColor}
			<div
				{title}
				class="bg-container"
				style="background-color: {bgColor(backgroundColor)}; opacity: {imgLoaded ? 0 : 1};"
			/>
		{/if}

		{#if isVisible}
			<Image
				{alt}
				{title}
				srcset={srcSetImgs}
				src={finalSrc}
				{sizes}
				style="opacity: {imgLoaded || !fadeIn ? 1 : 0}"
				on:imageLoad={onImageLoaded}
			/>
		{/if}
	</div>
</div>

<style>
	.outer {
		z-index: 0;
	}

	.initial {
		position: initial;
	}

	.relative {
		position: relative;
	}

	.inner {
		position: relative;
		overflow: hidden;
		z-index: 1;
	}

	.full {
		width: 100%;
	}

	.bg-container {
		position: absolute;
		top: 0;
		bottom: 0;
		transition-delay: '0.25s';
		right: 0;
		left: 0;
	}
</style>
