<script>
    import {graphOptions, dataStore} from "../../lib/common";
    import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from "sveltestrap";

    import CodeEditor from "../utils/CodeEditor.svelte";

    export let cell;

    let html;

    let localOptions;
    graphOptions.subscribe(options => {
        localOptions = options;
    });

    let modalOpen = false;
    const toggle = () => modalOpen = !modalOpen;

    function removeRecord() {
        toggle();
        ($dataStore)().filter(cell.value).remove();
    }

    let editor;

    function saveRecord() {
        toggle();
        ($dataStore)().filter(cell.value).update(JSON.parse(editor.getValue()));
    }


</script>

<td class="value pointed" colspan="{cell.colspan}" rowspan="{cell.rowspan}" on:click={() => toggle()}>
    {@html localOptions.displayer.run({record: cell.value}) }
</td>


<Modal isOpen={modalOpen} toggle={toggle} size="xl">
    <ModalHeader {toggle}>{@html localOptions.displayer.run({record: cell.value}) }</ModalHeader>
    <ModalBody>
        <CodeEditor bind:editor content={JSON.stringify(cell.value, null, 2)}/>
    </ModalBody>

    <ModalFooter>
        <Button color="success" on:click={() => saveRecord()}>Save</Button>
        <Button color="danger" on:click={() => removeRecord()}>Remove</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>

<style>
    td.value {
        border: 1px solid black;
        background-color: orange;
    }

    td {
        padding: 10px;
        margin: 10px;
    }

</style>