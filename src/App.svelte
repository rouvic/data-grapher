<script>
	import Graph from './components/Graph.svelte';
	import TopBar from './components/TopBar.svelte';
	import EditorTest from "./components/CodeEditor.svelte";
	import {Container, Row, Col} from "sveltestrap";
	import {Registry} from "./lib/common";
	import ScriptInput from "./components/scripts/ScriptSelector.svelte";

</script>


<TopBar></TopBar>
<main>
	<Graph></Graph>
</main>

<style>
	main {
		width: 96vw;
		height: 100vh;
		overflow-x: auto;
		overflow-y: auto;
		background-color: rgba(214,214,214,0.35);
	}
</style>