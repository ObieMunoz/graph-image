<script>
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import images from './data';
</script>

<h1>Svelte Image</h1>
<div>
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
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		max-width: 1064px;
		margin: 0 auto;
	}
</style>
