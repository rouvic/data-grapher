<script>
    import {TreeNode} from "./lib";

    export let node = new TreeNode(undefined);

    let open = node.hasAnyChild();

    function toggleOpen() {
        open = !open;
    }
</script>

<style>
    span {
        cursor: pointer;
        color: darkcyan;
    }
</style>

<ul>
    <li>
        {node.value}
        <span on:click={toggleOpen} href="#">
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