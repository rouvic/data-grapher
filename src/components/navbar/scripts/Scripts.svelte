<script>
    import { Input, NavLink, Icon, Modal, ModalBody, ModalHeader, ModalFooter, Button, TabPane, TabContent, Container, Row, Col, ListGroup, ListGroupItem} from 'sveltestrap';

    import {scripts} from "../../../lib/common";

    import {Script, Parameter} from "../../../lib/scripts";

    import CodeEditor from "../../utils/CodeEditor.svelte";
    let open = false;
    const toggle = () => open = !open;

    let selected;

    let editor;

    function refreshEditor() {
        if (editor) {
            editor.refresh();
        }
    }

    function select(script) {
        selected = script;
        editor.setValue(selected.code);
    }

</script>

<NavLink on:click={toggle}>Scripts</NavLink>
<Modal isOpen={open} toggle={toggle} size="xl" on:open={() => refreshEditor()}>
    <ModalHeader {toggle}>Scripts</ModalHeader>
    <ModalBody>

        <Container>
            <Row>
                <Col sm="2">
                    <ul>
                        {#each Array.from(scripts.entries()) as entry}
                            <li class="pointed" on:click={() => select(entry[1])}>
                                {entry[1].name}
                            </li>
                        {/each}
                    </ul>

                </Col>
                <Col sm="auto">
                    <CodeEditor bind:editor content={"let toto=12;"}/>
                </Col>
            </Row>
        </Container>
    </ModalBody>
</Modal>

<style>
    .editor-container {
        /*width: 400px;*/
        /*height: 400px;*/
    }
</style>

