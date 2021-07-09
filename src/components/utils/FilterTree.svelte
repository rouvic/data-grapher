<script>
    import {TreeNode} from "../../lib/trees";
    import {TaffyFilter, LabeledFilter, buildDateRanges} from "../../lib/taffy_utils";

    import {Input, Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from "sveltestrap";
    import ClickableIcon from "./ClickableIcon.svelte";
    import {dataStore} from "../../lib/common";


    export let node = new TreeNode(undefined);
    export let removable = false;


    let open = node.hasAnyChild();

    function toggleOpen() {
        open = !open;
    }

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function repaint() {
        node = node;
    }

    function openIfClosed() {
        if (!open) {
            toggleOpen();
        }
    }

    function addChild() {
        node.children.push(new TreeNode(new LabeledFilter("any", TaffyFilter.any())));
        openIfClosed();
        repaint();
    }

    function addDistinctFilters() {
        let column = prompt("Which column:");
        for (let value of ($dataStore)().distinct(column)) {
            node.children.push(new TreeNode(new LabeledFilter(value, TaffyFilter.columnsAre(column, value))));
        }
        openIfClosed();
        repaint();
    }

    function addDateRangeFilters() {
        let start = parseInt(prompt("start year"));
        let end = parseInt(prompt("end year"));
        let step = parseInt(prompt("step"));

        let tree = buildDateRanges(start, end, step);
        for (let c of tree.children) {
            node.children.push(c);
        }
        openIfClosed();
        repaint();
    }


    function removeThisFromParent() {
        dispatch('removed', { node:node });
    }

    function removeChildNode(child) {
        node.children = node.children.filter(x => x !== child);
        repaint();
    }

    function clearNode() {
        node.children.length = 0;
        repaint();
    }

    let isOpen = false;
</script>


<ul>
    <li class="tree-node">
        <div class="input-container m-md-auto">
            <!-- TODO: adapt input width to content -->
            <Input type="text" bind:value={node.value.label} />
        </div>
        :
        {node.value.filter}

        <ClickableIcon name="plus" tooltip="Add child" on:click={() => addChild()}/>
        {#if removable}
            <ClickableIcon name="dash" on:click={() => removeThisFromParent()}/>
        {/if}
        <ClickableIcon name="x-circle" tooltip="Clear" on:click={() => clearNode()}/>

        <Dropdown {isOpen} toggle={() => isOpen = !isOpen}>
            <DropdownToggle tag="span" class="inlined">
                <ClickableIcon name="caret-down" tooltip="More"/>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem on:click={() => addDistinctFilters()}>Distinct...</DropdownItem>
                <DropdownItem on:click={() => addDateRangeFilters()}>Date ranges...</DropdownItem>
            </DropdownMenu>
        </Dropdown>



        <span class="pointed" on:click={toggleOpen}>
            {open ? "(open)" : "(closed)"}
        </span>

    {#if open}
        {#if node.children.length > 0}
            {#each node.children as child}
                <svelte:self node={child} removable=true on:removed={() => removeChildNode(child)}/>
            {/each}
        {:else}
            <ul><li><i>No child.</i></li></ul>
        {/if}

    {/if}
    </li>
</ul>


<style>
    :global(.tree-node .input-container) {
        display: inline-block;
    }

    span {
        color: darkcyan;
    }

    span:hover {
        text-decoration: underline;
    }

    :global(.tree-node .dropdown) {
        display: inline;
    }
</style>
