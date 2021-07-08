<script>
    import {NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Button} from "sveltestrap";
    import CodeEditor from "../utils/CodeEditor.svelte";
    import {dataStore} from "../../lib/common";


    let open = false;
    const toggle = () => open = !open;

    let editor;
    let str = "{}";

    function insertRecord() {
        toggle();
        ($dataStore).insert(editor.getValue());
    }

</script>

<NavLink on:click={toggle}>Insert</NavLink>

<Modal isOpen={open} toggle={toggle} size="xl">
    <ModalHeader {toggle}>Scripts</ModalHeader>
    <ModalBody>
        <CodeEditor bind:editor={editor} content={str} />
    </ModalBody>
    <ModalFooter>
        <Button color="success" on:click={() => insertRecord()}>Save</Button>
        <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
</Modal>
