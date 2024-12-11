<script lang="ts">
	import type { GraphImageProps } from './types.ts';

	import Image from './Image.svelte';
	import { bgColor } from './_utils.js';
	import { visibility } from './actions/visibility.js';
	import { imageCache } from './cache.svelte.js';

	let {
		image,
		alt,
		title,
		baseURI,
		style = {},
		load = 'lazy',
		backgroundColor = '',
		blurryPlaceholder = false,
		...rest
	}: GraphImageProps = $props();

	let imgLoaded = $state(false);
	let isVisible = $state(false);
	let seenBefore = $derived(imageCache.seenBefore(image.handle));
	// convert style Record<string, any> = {} to a style string
	let styleString = $derived(
		Object.entries(style)
			.map(([key, value]) => `${key}: ${value};`)
			.join('')
	);
</script>

<div
	class="outer"
	class:initial={style.position === 'absolute'}
	class:relative={style.position !== 'absolute'}
>
	<div
		class="inner"
		style={styleString}
		use:visibility
		onintersect={() => {
			isVisible = true;
		}}
	>
		<!-- Preserve the aspect ratio. -->
		<div class="full" style="padding-bottom: {100 / (image.width / image.height)}%"></div>

		{#if blurryPlaceholder && load == 'lazy'}
			<Image
				{alt}
				{title}
				{baseURI}
				handle={image.handle}
				loading="eager"
				fit="crop"
				width={20}
				height={20}
				blur={2}
				absolute
			/>
		{/if}

		{#if backgroundColor}
			<div
				{title}
				class="bg-container"
				style="background-color: {bgColor(backgroundColor)}; opacity: {imgLoaded || seenBefore
					? 0
					: 1};"
			></div>
		{/if}

		{#if isVisible || seenBefore || load === 'eager'}
			<Image
				{...rest}
				{alt}
				{title}
				handle={image.handle}
				width={image.width}
				height={image.height}
				loading={load}
				{baseURI}
				absolute
				onload={(e) => {
					imgLoaded = true;
					imageCache.cacheImage(image.handle);
					if (rest.onload) rest.onload(e);
				}}
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
