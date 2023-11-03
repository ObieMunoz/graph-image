<script>import Image from "./Image.svelte";
import { bgColor, createFinalURL, inImageCache, listenToIntersections } from "./_utils.js";
export let image;
export let maxWidth = 800;
export let fadeIn = true;
export let fit = "crop";
export let withWebp = true;
export let title = "";
export let alt = "";
export let style = {};
export let blurryPlaceholder = true;
export let backgroundColor = "";
export let baseURI = "https://media.graphassets.com";
export let quality = void 0;
export let sharpen = void 0;
export let rotate = void 0;
export let watermark = void 0;
export let load = "lazy";
const seenBefore = inImageCache(image, false);
const styleString = Object.entries(style).map(([key, value]) => `${key}: ${value};`).join("");
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
let imageInnerWrapper;
let imgLoaded = false;
let IOSupported = typeof window !== "undefined" && typeof IntersectionObserver !== "undefined";
let isVisible = false;
function onImageLoaded() {
  if (IOSupported) {
    imgLoaded = true;
    inImageCache(image, true);
  }
}
$:
  if (imageInnerWrapper && IOSupported) {
    listenToIntersections(imageInnerWrapper, () => {
      isVisible = true;
      imgLoaded = false;
    });
  }
$:
  if (!seenBefore && IOSupported) {
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

		{#if blurryPlaceholder && load == 'lazy'}
			<Image
				{alt}
				{title}
				src={thumbSrc}
				style="opacity: {imgLoaded ? 0 : 1}; transition-delay: 0.25s"
				{load}
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
				{load}
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
