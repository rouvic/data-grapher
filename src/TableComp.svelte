<script>

    import {Table, EmptyCell, SpannedCell} from "./lib/tables";
    export let input = new Table([[]]);
    export let renderer = c => c;

</script>

<style>
    table {
        border-collapse: collapse;
        border: 1px solid black;
        border-spacing: 15px 15px;
    }

    td {
        padding: 10px;
    }

    td.value {
        border: 1px solid black;
    }

    td.empty {
        border: none;
    }
</style>

<table>
    {#each input.value as row}
        <tr>
            {#each row as cell}
                {#if cell instanceof EmptyCell}
                    <td class="empty" colspan="{cell.colspan}>" rowspan="{cell.rowspan}"></td>
                {:else if cell instanceof Table}
                    <td class="sub-table" colspan="{cell.colspan}" rowspan="{cell.rowspan}">
                        <svelte:self input={cell} renderer={renderer}/>
                    </td>
                {:else if cell instanceof SpannedCell}
                    <!-- nothing -->
                {:else}
                    <td class="value" colspan="{cell.colspan}" rowspan="{cell.rowspan}">
                        {renderer(cell)}
                    </td>
                {/if}
            {/each}
        </tr>
    {/each}
</table>
