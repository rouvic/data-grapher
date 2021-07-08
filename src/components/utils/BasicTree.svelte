<script>
    import {TreeNode} from "../../lib/trees";

    export let node = new TreeNode(undefined);

    let open = node.hasAnyChild();

    function toggleOpen() {
        open = !open;
    }
</script>

<style>
    span {
        color: darkcyan;
    }
</style>

<ul>
    <li>
        {node.value}
        <span class="pointed" on:click={toggleOpen}>
            {open ? "(open)" : "(closed)"}
        </span>

    {#if open}
        {#if node.children.length > 0}
            {#each node.children as child}
                <svelte:self node={child} />
            {/each}
        {:else}
            <ul><li><i>No children.</i></li></ul>

        {/if}

    {/if}
    </li>
</ul>