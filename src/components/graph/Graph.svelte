<script>
    import TableComp from "../utils/TableComp.svelte";

    import {dataStore, graphOptions} from "../../lib/common";

    import {TaffyFilter} from "../../lib/taffy_utils";
    import {Table, Cell, EmptyCell, HeadingCell, BeingComputedTable} from "../../lib/tables";

    import DataForm from '../navbar/Sources.svelte';
    import OptionsForm from '../navbar/Options.svelte';

    let localData;
    let localOptions;

    // transient, computed based on localData and localOptions
    let errorMessage;
    let queryCreator;
    let vTree, hTree;
    let computedTable, cellRenderer;
    let tableComp;

    dataStore.subscribe(value => {
        localData = value;
        localData.settings({onDBChange:function () {
                repaint();
            }});
        repaint();
    });

    graphOptions.subscribe(value => {
        localOptions = value;
        repaint();
    });

    // ---------- ACTUAL RENDERING ----------
    function repaint() {
        console.log("REPAINTING GRAPH");
        // Empty current graph
        errorMessage = queryCreator = computedTable = cellRenderer = undefined;
        if (!localOptions) {
            errorMessage = "No options";
            return;
        }
        else if (!localData) {
            errorMessage = "No data";
            return;
        }

        // Parsing the filter
        let globalFilter = new TaffyFilter(JSON.parse(localOptions.globalFilter));

        // Data accessor: filters the global input with provided filter.
        queryCreator = () => globalFilter.filter(localData());

        let hTree = localOptions.horizontalFilterTree;
        let vTree = localOptions.verticalFilterTree;

        let records = [];

        for (let vLeave of vTree.leaves()) {
            let row = [];

            for (let hLeave of hTree.leaves()) {
                let f = hLeave.value.filter.and(vLeave.value.filter);

                row.push(f.filter(queryCreator()).get());
            }

            records.push(row);
        }

        let tempComputedTable = [];
        let leavesMaxHeight = [];

        for (let [recordsRowIndex, recordsRow] of records.entries()) {
            // Calculate maximum height
            let maxHeight = Math.max(...recordsRow.map(recordsCell => recordsCell.length));
            maxHeight = Math.max(maxHeight, 1);
            leavesMaxHeight[recordsRowIndex] = maxHeight;

            let calculatedRows = new BeingComputedTable(maxHeight, hTree.leavesCount());

            recordsRow.forEach((recordsCell, column) => {
                for (const record of recordsCell) {
                    let span = 1;

                    if (localOptions.allowColumnSpan) {
                        while (column + span < recordsRow.length && recordsRow[column + span].includes(record)) {
                            recordsRow[column + span] = recordsRow[column + span].filter(x => x !== record);
                            span++;
                        }
                    }

                    calculatedRows.insertInColumn(column, new Cell(record, span));
                }
            });

            tempComputedTable.push(...calculatedRows.getValue());
        }

        // headings
        let horizontalDepth = hTree.depth();
        let verticalDepth = vTree.depth();
        let verticalHeadingNeededColumns = 1 + verticalDepth;
        let horizontalHeadingNeededRows = 1 + horizontalDepth;

        if (localOptions.horizontalHeadingVisible) {
            let horizontalHeadingRows = [];

            for (let depth = 0; depth <= horizontalDepth; depth++) {
                let row = [];

                for (let child of hTree.childrenAtDepth(depth)) {
                    let colspan = child.leavesCount();
                    // let colspan = 1;
                    let rowspan = 1;
                    if (child.isLeaf()) {
                        rowspan = horizontalDepth - depth + 1; // we add 1 because the rowspan starts at 1.
                    }

                    row.push(HeadingCell.from(child, colspan, rowspan));
                }
                horizontalHeadingRows.push(row);
            }

            if (localOptions.verticalHeadingVisible) {
                horizontalHeadingRows[0].unshift(EmptyCell.withSpan(verticalHeadingNeededColumns, horizontalHeadingNeededRows));
            }

            tempComputedTable.unshift(...horizontalHeadingRows);
        }


        if (localOptions.verticalHeadingVisible) {
            // Since the table is row major, we have to unshift to the existing rows.
            // We loop backwards because of the use of unshift method on rows.
            let rowspans = [];

            for (let depth = verticalDepth; depth >= 0; depth--) {

                if (depth === verticalDepth) {
                    rowspans = leavesMaxHeight;
                }
                else {
                    let temp = [];
                    let i = 0;

                    for (const [childIndex, child] of vTree.childrenAtDepth(depth).entries()) {
                        let span = 0;

                        if (!child.hasAnyChild()) {
                            span = rowspans[i];
                            i++;
                        }
                        else {
                            for (let j = 0; j < child.children.length; j++) {
                                span += rowspans[i];
                                i++;
                            }
                        }

                        temp[childIndex] = span;
                    }

                    rowspans = temp;
                }

                let rowIndex = 0;

                if (localOptions.horizontalHeadingVisible) {
                    rowIndex += horizontalHeadingNeededRows;
                }

                for (const [i, child] of vTree.childrenAtDepth(depth).entries()) {
                    let rowspan = rowspans[i];
                    let colspan = 1;
                    if (child.isLeaf()) {
                        colspan = verticalDepth - depth + 1; // we add 1 because the colspan starts at 1.
                    }

                    tempComputedTable[rowIndex].unshift(HeadingCell.from(child, colspan, rowspan));

                    rowIndex += rowspan;
                }
            }
        }


        console.log("CALLED =");
        computedTable = new Table(tempComputedTable);

        cellRenderer = cell => {
            if (cell instanceof HeadingCell) {
                return cell.value.value.label;
            }
            else {
                return cell.value.title + " (" + cell.value.date + ") from " + cell.value._source;
            }
        };
    }

    function clicked() {
        console.log("computed = " + computedTable.value);
    }

</script>

    <div class="graph-container">
        {#if errorMessage}
            <p>{errorMessage}</p>
        {:else}
            <TableComp input={computedTable} bind:renderer={cellRenderer} />
        {/if}
    </div>

