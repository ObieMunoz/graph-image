<script>
	import GraphImage from '$lib/GraphImage/GraphImage.svelte';
	import images from './data';
</script>

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
