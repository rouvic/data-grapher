<script>
    export let name;
    import {Icon, Tooltip} from "sveltestrap";
    import {isEmpty} from "../lib/common";
    export let tooltip = "";
    let id = "" + Math.random();
    id = id.substring(2, id.length);
    id = "random-id-" + id;
</script>



{#if isEmpty(tooltip)}
    <span class="pointed" on:click><Icon name={name}/></span>
{:else}
    <span class="pointed" id="{id}" on:click><Icon name={name}/></span>
    <Tooltip target="{id}" placement="bottom">
        {tooltip}
    </Tooltip>
{/if}