<script lang="ts">
	import { GraphImage, GraphImageTypes } from 'graph-image';

	export let logo: GraphImageTypes.GraphAsset;
</script>

<div class="banner">
	<GraphImage image={logo} fit="clip" load="eager" />
</div>

<style>
	.banner {
		max-height: 360px;
	}
</style>
