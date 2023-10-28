<script lang="ts">
	import Image from './Image.svelte';
	import {
		bgColor,
		constructURL,
		getWidths,
		imgSizes,
		inImageCache,
		listenToIntersections,
		resizeImage,
		srcSet
	} from './_utils.js';
	import type { ImageProps } from './types.ts';

	export let image: ImageProps;
	export let maxWidth: number = 800;
	export let fadeIn: boolean = true;
	export let fit: 'clip' | 'crop' | 'scale' | 'max' = 'crop';
	export let withWebp: boolean = true;
	export let transforms: string[] = [];
	export let title: string = '';
	export let alt: string = '';
	export let style: Record<string, any> = {};
	export let blurryPlaceholder: boolean = true;
	export let backgroundColor: string | boolean = '';
	export let baseURI: string = 'https://media.graphassets.com';

	const seenBefore = inImageCache(image, false);
	// convert style Record<string, any> = {} to a style string
	const styleString = Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join('');

	let divRef: HTMLElement | null = null;
	let finalSrc = '';
	let imgLoaded = false;
	let IOSupported = typeof IntersectionObserver !== 'undefined';
	let isVisible = false;
	let thumbSrc = '';
	let srcSetImgs = '';
	let sizes = '';

	if (!seenBefore && IOSupported) {
		isVisible = false;
		imgLoaded = false;
	}

	function onImageLoaded() {
		if (IOSupported) {
			imgLoaded = true;
			inImageCache(image, true);
		}
	}

	$: if (divRef && IOSupported) {
		listenToIntersections(divRef, () => {
			isVisible = true;
			imgLoaded = false;
		});
	}

	$: if (image && image.width && image.height && image.handle) {
		const srcBase = constructURL(image.handle, withWebp, baseURI);
		const thumbBase = constructURL(image.handle, false, baseURI);

		// Final Image URL
		const sizedSrc = srcBase(resizeImage({ width: image.width, height: image.height, fit }));
		finalSrc = sizedSrc(transforms);

		// Blurry Placeholder URL
		const thumbSize = { width: 20, height: 20, fit: 'crop' };
		thumbSrc = thumbBase(resizeImage(thumbSize))(['blur=amount:2']);

		// srcSet if maxWidth is provided
		srcSetImgs = srcSet(srcBase, getWidths(image.width, maxWidth), fit, transforms);
		sizes = imgSizes(maxWidth);
	}
</script>

<div
	class="outer"
	class:initial={style.position === 'absolute'}
	class:relative={style.position !== 'absolute'}
>
	<div class="inner" style={styleString} bind:this={divRef}>
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
