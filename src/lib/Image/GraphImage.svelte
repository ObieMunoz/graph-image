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
	} from './_utils';
	import type { ImageProps } from './types';

	export let title: string = '';
	export let alt: string = '';
	export let className: string | object = '';
	export let outerWrapperClassName: string | object = '';
	export let style: Record<string, any> = {};
	export let fit: 'clip' | 'crop' | 'scale' | 'max' = 'crop';
	export let maxWidth: number = 800;
	export let withWebp: boolean = true;
	export let transforms: string[] = [];
	export let blurryPlaceholder: boolean = true;
	export let backgroundColor: string | boolean = '';
	export let fadeIn: boolean = true;
	export let baseURI: string = 'https://media.graphassets.com';
	export let image: ImageProps;

	let imgLoaded = false;
	let isVisible = false;
	let thumbSrc = '';
	let finalSrc = '';
	let srcSetImgs = '';
	let sizes = '';
	let divRef: HTMLElement | null = null;
	let IOSupported = typeof IntersectionObserver !== 'undefined';

	// convert style Record<string, any> = {} to a style string
	const styleString = Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join('');

	const seenBefore = inImageCache(image, false);

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

		// Construct the final image url
		const sizedSrc = srcBase(resizeImage({ width: image.width, height: image.height, fit }));
		finalSrc = sizedSrc(transforms);

		// Construct blurry placeholder url
		const thumbSize = { width: 20, height: 20, fit: 'crop' };
		thumbSrc = thumbBase(resizeImage(thumbSize))(['blur=amount:2']);

		// Construct srcSet if maxWidth provided
		const resizeOptions = `resize=w:${image.width},fit:${fit}`;
		srcSetImgs = srcSet(srcBase(resizeOptions), getWidths(image.width, maxWidth), fit, transforms);
		sizes = imgSizes(maxWidth);
	}
</script>

<div
	class="{outerWrapperClassName} graphcms-image-outer-wrapper"
	style="z-index: 0; position: {style.position === 'absolute' ? 'initial' : 'relative'}"
>
	<div
		class="{className} graphcms-image-wrapper"
		style="position: relative; overflow: hidden; z-index: 1; {styleString}"
		bind:this={divRef}
	>
		<!-- Preserve the aspect ratio. -->
		<div style="width: 100%; padding-bottom: {100 / (image.width / image.height)}%" />

		{#if blurryPlaceholder}
			<!-- Show the blurry thumbnail image. -->
			<Image
				{alt}
				{title}
				src={thumbSrc}
				style="opacity: {imgLoaded ? 0 : 1}; transition-delay: 0.25s"
			/>
		{/if}

		{#if backgroundColor}
			<!-- Show a solid background color. -->
			<div
				{title}
				style="background-color: {bgColor(
					backgroundColor
				)}; position: absolute; top: 0; bottom: 0; opacity: {imgLoaded
					? 0
					: 1}; transition-delay: 0.25s; right: 0; left: 0"
			/>
		{/if}

		{#if isVisible}
			<!-- Once the image is visible, start downloading the image -->
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
