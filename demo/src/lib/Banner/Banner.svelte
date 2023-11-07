<script lang="ts">
	import { GraphImage, GraphImageTypes } from 'graph-image';

	export let logo: GraphImageTypes.GraphAsset;
</script>

<div class="banner">
	<GraphImage image={{ ...logo, width: 1200, height: 400 }} fit="clip" load="eager" />
</div>
