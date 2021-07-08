<script>
    import {TreeNode} from "../../lib/trees";
    import {TaffyFilter, LabeledFilter} from "../../lib/taffy_utils";

    import {Input} from "sveltestrap";
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


    function removeThisFromParent() {
        dispatch('removed', { node:node });
    }

    function removeChildNode(child) {
        node.children = node.children.filter(x => x !== child);
        repaint();
    }
</script>

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
</style>

<ul>
    <li class="tree-node">
        <div class="input-container m-md-auto">
            <!-- TODO: adapt input width to content -->
            <Input type="text" bind:value={node.value.label} />
        </div>
        :
        {node.value.filter}

        <ClickableIcon name="plus" tooltip="Add child" on:click={() => addChild()}/>
        <ClickableIcon name="sort-alpha-down" tooltip="Add distinct filters" on:click={() => addDistinctFilters()}/>
        <ClickableIcon name="sort-numeric-down" tooltip="Add numeric range filters" on:click={() => addChild()}/>

        {#if removable}
            <ClickableIcon name="dash" on:click={() => removeThisFromParent()}/>
        {/if}

        <span class="pointed" on:click={toggleOpen}>
            {open ? "(open)" : "(closed)"}
        </span>

    {#if open}
        {#if node.children.length > 0}
            {#each node.children as child}
                <svelte:self node={child} removable=true on:removed={() => removeChildNode(child)}/>
            {/each}
        {:else}
            <ul><li><i>No children.</i></li></ul>
        {/if}

    {/if}
    </li>
</ul>
