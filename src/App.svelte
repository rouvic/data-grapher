<script>
	import Graph from './components/Graph.svelte';
	import DataForm from './components/DataForm.svelte';
	import OptionsForm from './components/OptionsForm.svelte';
</script>

<main>
	<h1>Data grapher</h1>
	<Graph></Graph>
	<DataForm></DataForm>
	<OptionsForm></OptionsForm>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>