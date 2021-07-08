<script>

    import {Table, EmptyCell, SpannedCell, HeadingCell} from "../../lib/tables";
    import RecordCell from "../graph/RecordCell.svelte";

    export let input = new Table([[]]);
    export let renderer = c => c;

</script>

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
                {:else if cell instanceof HeadingCell}
                    <td class="heading" colspan="{cell.colspan}" rowspan="{cell.rowspan}">
                        {renderer(cell)}
                    </td>
                {:else}
                    <RecordCell cell={cell} />
                {/if}
            {/each}
        </tr>
    {/each}
</table>

<style>
    table {
        border-collapse: collapse;
        border: 1px solid black;
        border-spacing: 15px 15px;
    }

    td {
        padding: 10px;
    }

    td.empty {
        border: none;
    }

    td.heading {
        position: sticky;
        border: 1px solid black;
    }
</style>

