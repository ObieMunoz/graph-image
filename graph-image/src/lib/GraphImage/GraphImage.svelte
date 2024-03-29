<script lang="ts">
	import Image from './Image.svelte';
	import { bgColor, inImageCache, listenToIntersections } from './_utils.js';
	import type { Fit, GraphAsset, Load, Watermark } from './types.ts';

	export let image: GraphAsset;
	export let alt: string = '';
	export let baseURI: string = 'https://media.graphassets.com';
	export let title: string = '';

	// --- Styling and Presentation ---
	export let fit: Fit = 'crop';
	export let maxWidth: number | undefined = undefined;
	export let style: Record<string, any> = {};
	export let load: Load = 'lazy';

	// --- Image Enhancements and Effects ---
	export let backgroundColor: string | boolean = '';
	export let blurryPlaceholder: boolean = false;
	export let fadeIn: boolean = true;
	export let quality: number | undefined = undefined;
	export let rotate: number | undefined = undefined;
	export let sharpen: number | undefined = undefined;
	export let withWebp: boolean = true;

	// --- Miscellaneous Features ---
	export let watermark: Watermark | undefined = undefined;

	let imageInnerWrapper: HTMLElement;
	let imgLoaded = false;
	let IOSupported = typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined';
	let isVisible = false;

	function onImageLoaded() {
		if (IOSupported) {
			imgLoaded = true;
			inImageCache(image, true);
		}
	}

	$: seenBefore = inImageCache(image, false);
	// convert style Record<string, any> = {} to a style string
	$: styleString = Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join('');

	$: if (imageInnerWrapper && IOSupported) {
		listenToIntersections(imageInnerWrapper, () => {
			isVisible = true;
			imgLoaded = false;
		});
	}

	$: if (!seenBefore && IOSupported) {
		isVisible = false;
		imgLoaded = false;
	} else if (!IOSupported || seenBefore) {
		isVisible = true;
		imgLoaded = true;
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

		{#if blurryPlaceholder && load == 'lazy'}
			<Image
				{alt}
				{title}
				{baseURI}
				handle={image.handle}
				load="eager"
				fit="crop"
				width={20}
				height={20}
				opacity={1}
				blur={2}
				absolute
			/>
		{/if}

		{#if backgroundColor}
			<div
				{title}
				class="bg-container"
				style="background-color: {bgColor(backgroundColor)}; opacity: {imgLoaded ? 0 : 1};"
			/>
		{/if}

		{#if isVisible || load === 'eager'}
			<Image
				{alt}
				{title}
				handle={image.handle}
				{load}
				{baseURI}
				{maxWidth}
				{fit}
				{quality}
				{rotate}
				{sharpen}
				{withWebp}
				{watermark}
				opacity={fadeIn ? 0 : 1}
				width={image.width}
				height={image.height}
				center={fit === 'center-contain'}
				absolute
				on:load={onImageLoaded}
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
