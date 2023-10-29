<script>
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import { assets, features } from './data.js';
</script>

<header>
	<!-- svelte-ignore a11y-img-redundant-alt -->
	<!-- <img src="/graph-image.png" alt="graph-image" /> -->
	<div class="header-image" />
	<h1>graph-image</h1>
	<p>Universal lazy-loading, auto-compressed images with Svelte/SvelteKit and Hygraph.</p>
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
		This Svelte project is a port of the original
		<a href="https://npmjs.org/package/@graphcms/react-image">@graphcms/react-image</a> for React by
		Hygraph. All thanks to the creators and contributors of the original project for their remarkable
		work.
	</aside>
</header>

<div class="gallery">
	{#each assets as image}
		<div>
			<GraphImage
				title="Sample"
				alt="Sample"
				image={{ handle: image.handle, width: 1920, height: 1080 }}
				withWebp
				maxWidth={500}
			/>
		</div>
	{/each}
</div>

<style>
	.header-image {
		background-image: url('/graph-image.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center center;
		height: 150px;
	}

	header {
		background-color: #242424;
		padding: 2rem 3rem;
		border-radius: 10px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	}

	header h1 {
		position: absolute;
		top: 0;
		right: 0;
		height: 0;
		width: 0;
		overflow: none;
	}

	header p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #cfcfcf;
	}

	header li {
		font-size: 1.2rem;
		color: #cfcfcf;
		margin-bottom: 0.75rem;
	}

	nav {
		display: flex;
		flex-direction: column; /* stack them vertically */
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	nav a {
		background-color: #4e4feb;
		color: #fff;
		padding: 0.4rem 0.8rem; /* reduced padding */
		border: none;
		border-radius: 8px;
		font-weight: bold;
		text-align: center;
		text-decoration: none;
		transition: background-color 0.2s ease;
		font-size: 0.9rem; /* smaller font size for mobile */
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

	.gallery {
		display: grid;
		grid-template-columns: 1fr; /* Default: 1 image per row */
		justify-content: center;
		gap: 1rem;
		max-width: 1200px;
		padding: 1rem;
		margin: 0 auto;
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

		.header-image {
			height: 250px;
		}
	}

	@media (min-width: 900px) {
		.gallery {
			grid-template-columns: repeat(3, 1fr); /* 3 images per row */
		}

		.header-image {
			height: 350px;
		}
	}
</style>
