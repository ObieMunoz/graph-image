<script lang="ts">
	import { run } from 'svelte/legacy';

	import Image from './Image.svelte';
	import { bgColor, inImageCache, listenToIntersections } from './_utils.js';
	import type { Fit, GraphAsset, Load, Watermark } from './types.ts';


	

	

	
	interface Props {
		image: GraphAsset;
		alt?: string;
		baseURI?: string;
		title?: string;
		// --- Styling and Presentation ---
		fit?: Fit;
		maxWidth?: number | undefined;
		style?: Record<string, any>;
		load?: Load;
		// --- Image Enhancements and Effects ---
		backgroundColor?: string | boolean;
		blurryPlaceholder?: boolean;
		fadeIn?: boolean;
		quality?: number | undefined;
		rotate?: number | undefined;
		sharpen?: number | undefined;
		withWebp?: boolean;
		// --- Miscellaneous Features ---
		watermark?: Watermark | undefined;
	}

	let {
		image,
		alt = '',
		baseURI = 'https://media.graphassets.com',
		title = '',
		fit = 'crop',
		maxWidth = undefined,
		style = {},
		load = 'lazy',
		backgroundColor = '',
		blurryPlaceholder = false,
		fadeIn = true,
		quality = undefined,
		rotate = undefined,
		sharpen = undefined,
		withWebp = true,
		watermark = undefined
	}: Props = $props();

	let imageInnerWrapper: HTMLElement = $state();
	let imgLoaded = $state(false);
	let IOSupported = typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined';
	let isVisible = $state(false);

	function onImageLoaded() {
		if (IOSupported) {
			imgLoaded = true;
			inImageCache(image, true);
		}
	}

	let seenBefore = $derived(inImageCache(image, false));
	// convert style Record<string, any> = {} to a style string
	let styleString = $derived(Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join(''));

	run(() => {
		if (imageInnerWrapper && IOSupported) {
			listenToIntersections(imageInnerWrapper, () => {
				isVisible = true;
				imgLoaded = false;
			});
		}
	});

	run(() => {
		if (!seenBefore && IOSupported) {
			isVisible = false;
			imgLoaded = false;
		} else if (!IOSupported || seenBefore) {
			isVisible = true;
			imgLoaded = true;
		}
	});
</script>

<div
	class="outer"
	class:initial={style.position === 'absolute'}
	class:relative={style.position !== 'absolute'}
>
	<div class="inner" style={styleString} bind:this={imageInnerWrapper}>
		<!-- Preserve the aspect ratio. -->
		<div class="full" style="padding-bottom: {100 / (image.width / image.height)}%"></div>

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
			></div>
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
