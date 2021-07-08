<script>
	import Graph from './components/Graph.svelte';
	import TopBar from './components/TopBar.svelte';
	import EditorTest from "./components/CodeEditor.svelte";
	import {Container, Row, Col} from "sveltestrap";
	import {Registry} from "./lib/common";
	import ScriptInput from "./components/scripts/ScriptSelector.svelte";

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