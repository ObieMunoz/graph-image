<script>
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import images from './baseImgs';
</script>

<h1>SVELTE PORT</h1>
{#each images as sampleImage}
	<GraphImage
		title="Sample"
		alt="Sample"
		image={{ handle: sampleImage.handle, width: 1920, height: 1080 }}
		withWebp
		maxWidth={500}
		style={{
			width: '500px',
			margin: '32px 16px'
		}}
	/>
{/each}
