<script lang="ts">
	import { GraphImage, GraphImageTypes } from 'graph-image';

	interface Props {
		logo: GraphImageTypes.GraphAsset;
	}

	let { logo }: Props = $props();
</script>

<div class="banner">
	<GraphImage image={{ ...logo, width: 1200, height: 400 }} fit="clip" load="eager" />
</div>
