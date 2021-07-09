<script>
    import {graphOptions, scripts} from "../../lib/common";

    import {Options} from "../../lib/options";

    import {NavLink, Icon, Accordion, AccordionItem, Offcanvas, Button, Input, FormGroup, Label} from 'sveltestrap';
    import ScriptSelector from "./scripts/ScriptSelector.svelte";
    import FilterTree from "../utils/FilterTree.svelte";



    let visible = false;

    function toggle() {
        visible = !visible;
    }

    let boundOptions = new Options();

    graphOptions.subscribe(options => {
        boundOptions = options;
    });

    function validateOptions() {
        graphOptions.set(boundOptions);
        if (visible) {
            toggle();
        }
    }
</script>


<tutorial id="options-button">
    <NavLink on:click={toggle}>Options</NavLink>
</tutorial>

<div class="options-form-container">
    <Offcanvas isOpen={visible} {toggle} header="Options" placement="end" container="inline">
        <h5>Horizontal heading</h5>
            <FormGroup>
                <Input type="checkbox" label="Show" bind:checked={boundOptions.horizontalHeadingVisible} />
                <Input type=checkbox label="Allow column span" bind:checked={boundOptions.allowColumnSpan} />
            </FormGroup>
            <h6>Filter tree</h6>
            <FilterTree bind:node={boundOptions.horizontalFilterTree}/>
        <h5>Vertical heading</h5>
            <FormGroup>
                <Input type=checkbox label="Show" bind:checked={boundOptions.verticalHeadingVisible} />
            </FormGroup>
            <h6>Filter tree</h6>
            <FilterTree bind:node={boundOptions.verticalFilterTree}/>
        <h5>Rendering</h5>
            <FormGroup>
                <Label>Text rendering</Label>
                <ScriptSelector bind:value={boundOptions.displayText} />
            </FormGroup>
            <FormGroup>
                <Label>Background color</Label>
                <ScriptSelector bind:value={boundOptions.backgroundColor} />
            </FormGroup>

        <Button on:click={validateOptions}>Validate</Button>
    </Offcanvas>
</div>

<style>

    :global(.options-form-container .offcanvas-end) {
        width: 800px;
    }
</style>