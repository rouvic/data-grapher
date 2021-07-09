<script>
	import Graph from './components/graph/Graph.svelte';
	import TopBar from './components/navbar/TopBar.svelte';
	import {applyHistMaths} from "./lib/presets";


	const params = new URLSearchParams(window.location.search);

	if (params.has("preset")) {
		if (params.get("preset") === "hist-maths") {
			applyHistMaths();
		}
	}
</script>


<TopBar></TopBar>
<div class="main-container">
	<Graph></Graph>
</div>

<style>
	.main-container {
		overflow: auto;
		/* TODO: fix this to occupy all the left space below navbar */
		height: 90vh;
		width: 100vw;
	}
</style>