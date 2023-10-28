<script>
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import images from './data';
</script>

<main>
	<div>
		<h1>svelte-image</h1>

		<p>Universal lazy-loading, auto-compressed images with Svelte/SvelteKit and Hygraph.</p>

		<p>
			<a href="https://svelte-image.obiemunoz.com">Demo</a> •
			<a href="https://www.obiemunoz.com">Obie Munoz</a>
		</p>

		<ul>
			<li>* Resize large images to the size needed by your design.</li>
			<li>
				* Generate multiple smaller images to make sure devices download the optimal-sized one.
			</li>
			<li>* Automatically compress and optimize your image with the powerful Filestack API.</li>
			<li>* Efficiently lazy load images to speed initial page load and save bandwidth.</li>
			<li>
				* Use the "blur-up" technique or solid background color to show a preview of the image while
				it loads.
			</li>
			<li>* Hold the image position so your page doesn't jump while images load.</li>
		</ul>

		<p>
			<strong>Credits & Contribution:</strong> This Svelte project is a port of the original
			<a href="https://npmjs.org/package/@graphcms/react-image">@graphcms/react-image</a> for React by
			Hygraph. All thanks to the creators and contributors of the original project for their remarkable
			work.
		</p>
	</div>
	{#each images as image}
		<GraphImage
			title="Sample"
			alt="Sample"
			image={{ handle: image.handle, width: 1920, height: 1080 }}
			withWebp
			maxWidth={500}
			style={{
				width: '500px',
				margin: '32px 16px'
			}}
		/>
	{/each}
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		max-width: 1064px;
		margin: 0 auto;
		text-align: center;
	}

	* {
		font-size: x-large;
	}

	ul {
		list-style-type: none;
		text-align: start;
	}
</style>
