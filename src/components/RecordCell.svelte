<script>
    import {graphOptions} from "../lib/common";
    import {Modal, ModalHeader, ModalBody} from "sveltestrap";
    export let cell;

    let html;

    graphOptions.subscribe(options => {
        // html = window.eval.call(window,'(function (record) {'+value.displayer+'})')(cell.value);
        let params = {record: cell.value};
        html = options.displayer.run(params);
    });

    function doubleClicked() {
        alert("you double clicked on " + html);
    }

    let modalOpen = false;
    const toggle = () => modalOpen = !modalOpen;



    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

</script>

<td class="value pointed" colspan="{cell.colspan}" rowspan="{cell.rowspan}" on:dblclick={() => toggle()}>
    {@html html}
</td>


<Modal isOpen={modalOpen} toggle={toggle} size="xl">
    <ModalHeader {toggle}>{html}</ModalHeader>
    <ModalBody>
        {@html syntaxHighlight(JSON.stringify(cell.value, null, 2))}
    </ModalBody>
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