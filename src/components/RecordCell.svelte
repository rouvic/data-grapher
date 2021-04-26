<script>
    export let cell;

    import { getContext } from 'svelte';
    import RecordModal from './RecordModal.svelte';

    const { open } = getContext('simple-modal');

    function provideCallback(value) {
        return () => {
            open(RecordModal, {record: value});
        };
    }

</script>

<td class="value" colspan="{cell.colspan}" rowspan="{cell.rowspan}" on:dblclick={provideCallback(cell.value)}>
    {cell.value.title}
</td>

<style>
    td.value {
        border: 1px solid black;
    }

    td {
        padding: 10px;
    }

</style>