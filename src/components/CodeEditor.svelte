<script>
    import 'codemirror/mode/javascript/javascript'
    import CodeMirror from '@joshnuss/svelte-codemirror'

    export let content;
    export let editor;


</script>

<main>
    <CodeMirror bind:editor options={{ lineNumbers: true, extraKeys: {"Ctrl-Space": "autocomplete"} }} value={content}/>
</main>

<style>

</style>
