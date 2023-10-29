<script lang="ts">
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import type { PageData } from './$types.js';

	export let data: PageData;

	const logo = data.logo;
	const headline = data.headline;
	const features = data.features;
	const galleryImages = data.galleryImages;

	const SEO = {
		title: 'Graph Image',
		description:
			"Graph Image is a Svelte component offering advanced lazy-loading, modern compression with .webp support, device-specific image variants, optimized initial page speed, 'blur-up' technique for seamless image loading, and consistent image positioning to prevent layout jumps."
	};
</script>

<svelte:head>
	<title>Graph Image</title>
	<meta property="og:title" content={SEO.title} />
	<meta name="description" content={SEO.description} />
	<meta property="og:description" content={SEO.description} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SEO.title} />
	<meta name="twitter:description" content={SEO.description} />
	<!-- <meta property="og:image" content="URL_TO_YOUR_IMAGE"> -->
	<!-- <meta name="twitter:image" content="URL_TO_YOUR_IMAGE"> -->
</svelte:head>

<header>
	<h1 class="hidden">graph-image</h1>
	<div class="banner">
		<GraphImage image={logo} />
	</div>
	<p>{headline}</p>
	<ul>
		{#each features as feature}
			<li><span>✓</span> {feature}</li>
		{/each}
	</ul>
	<nav>
		<a href="https://www.obiemunoz.com" target="_blank">Obie Munoz</a>
		<a href="https://www.github.com/obiemunoz/graph-image/" target="_blank"> GitHub </a>
	</nav>
	<aside>
		Special thanks to the creators and contributors of <a
			href="https://npmjs.org/package/@graphcms/react-image">@graphcms/react-image</a
		> for their original work in React that this project was based on.
	</aside>
</header>

<div class="gallery">
	{#each galleryImages as image}
		<div>
			<GraphImage
				title="Sample"
				alt="Sample"
				image={{ ...image, width: 3840, height: 2160 }}
				withWebp
				maxWidth={1200}
			/>
		</div>
	{/each}
</div>

<style>
	header {
		background-color: #242424;
		padding: 1.5rem 2rem;
		border-radius: 10px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	}

	.hidden {
		position: absolute;
		top: 0;
		right: 0;
		height: 0;
		width: 0;
		overflow: hidden;
	}

	header p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #cfcfcf;
		text-align: center;
	}

	header li {
		font-size: 1.2rem;
		color: #cfcfcf;
		margin-bottom: 0.75rem;
	}

	nav {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	nav a {
		background-color: #4e4feb;
		color: #fff;
		padding: 0.4rem 0.8rem;
		border: none;
		border-radius: 8px;
		font-weight: bold;
		text-align: center;
		text-decoration: none;
		transition: background-color 0.2s ease;
		font-size: 0.9rem;
	}

	nav a:hover {
		background-color: #068fff;
		color: #fff;
	}

	ul {
		list-style: none;
		margin-block: 0;
		margin-inline: 0;
		padding-inline-start: 0;
	}

	ul li {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	ul span {
		color: #068fff;
		font-weight: bold;
	}

	a {
		color: #068fff;
	}

	a:hover {
		color: #4e4feb;
	}

	aside {
		font-size: 0.9rem;
		margin-top: 2rem;
		border-top: 1px solid #333;
		padding-top: 1rem;
		color: #a9a9a9;
	}

	.banner {
		max-height: 360px;
	}

	.gallery {
		display: grid;
		grid-template-columns: 1fr; /* Default: 1 image per row */
		justify-content: center;
		gap: 1rem;
		max-width: 1200px;
		margin: 1rem auto;
	}

	.gallery > div:hover {
		transform: scale(1.05);
		transition-duration: 0.5s;
		z-index: 3;
	}

	.gallery > div {
		border: 1px solid #333;
		border-radius: 10px;
		overflow: hidden;
		height: fit-content;
	}

	@media (min-width: 600px) {
		.gallery {
			grid-template-columns: repeat(2, 1fr); /* 2 images per row */
		}

		nav {
			flex-direction: row;
		}
		nav a {
			font-size: 1rem; /* reset the font size for larger screens */
		}
	}
</style>
