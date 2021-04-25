<script>

    import {data, graphOptions} from "./stores";
    import {TreeNode, LabeledFilter, TaffyFilter, BeingComputedTable} from "./lib";
    import TableComp from "./TableComp.svelte";
    import {Table, Cell, EmptyCell, HeadingCell} from "./tables";

    let localData;
    let localOptions;

    // transient, computed based on localData and localOptions
    let errorMessage;
    let queryCreator;
    let vFilterTree, hFilterTree;
    let computedTable, cellRenderer;
    let horizontalHeading, verticalHeading;

    data.subscribe(value => {
        localData = value;
        repaint();
    });

    graphOptions.subscribe(value => {
        localOptions = value;
        repaint();
    });

    // ---------- ACTUAL RENDERING ----------
    function repaint() {
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
        let globalFilter = new TaffyFilter(JSON.parse(localOptions.filter));

        // Data accessor: filters the global input with provided filter.
        queryCreator = () => globalFilter.filter(localData());

        // let hTree = buildIntegerRangeFilterTree("date", 1900, 1920, 2);

        let hTree = new TreeNode(new LabeledFilter("Date", TaffyFilter.any()));
        hTree.children.push(new TreeNode(new LabeledFilter("Date begins with 18", TaffyFilter.columnWithOperator("date", "left", "18"))));
        hTree.children.push(new TreeNode(new LabeledFilter("Any date", TaffyFilter.any())));
        hTree.children.push(new TreeNode(new LabeledFilter("Date ends with 12", TaffyFilter.columnWithOperator("date", "right", "12"))));

        let vTree = new TreeNode(new LabeledFilter("any composer", TaffyFilter.any()));
        let french = new TreeNode(new LabeledFilter("french composer"), TaffyFilter.any());
        french.children.push(new TreeNode(new LabeledFilter("Berlioz", TaffyFilter.columnsAre("composer", "Berlioz"))));
        french.children.push(new TreeNode(new LabeledFilter("Debussy", TaffyFilter.columnsAre("composer", "Debussy"))));
        french.children.push(new TreeNode(new LabeledFilter("Ravel", TaffyFilter.columnsAre("composer", "Ravel"))));
        vTree.children.push(french);
        vTree.children.push(new TreeNode(new LabeledFilter("Schönberg", TaffyFilter.columnsAre("composer", "Schönberg"))));
        vTree.children.push(new TreeNode(new LabeledFilter("Stravinsky", TaffyFilter.columnsAre("composer", "Stravinsky"))));

        let records = [];

        for (let vLeave of vTree.leaves()) {
            let row = [];

            for (let hLeave of hTree.leaves()) {
                let f = hLeave.value.filter.and(vLeave.value.filter);

                row.push(f.filter(queryCreator()).get());
            }

            records.push(row);
        }

        computedTable = [];
        let allowColSpan = true;

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

                    if (allowColSpan) {
                        while (column + span < recordsRow.length && recordsRow[column + span].includes(record)) {
                            recordsRow[column + span] = recordsRow[column + span].filter(x => x !== record);
                            span++;
                        }
                    }

                    calculatedRows.insertInColumn(column, new Cell(record, span));
                }
            });

            computedTable.push(...calculatedRows.getValue());
        }

        // headings
        let horizontalDepth = hTree.depth();
        let verticalDepth = vTree.depth();
        let verticalHeadingNeededColumns = 1 + verticalDepth;
        let horizontalHeadingNeededRows = 1 + horizontalDepth;

        let horizontalHeading = true;
        let verticalHeading = true;

        if (horizontalHeading) {
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

            if (verticalHeading) {
                horizontalHeadingRows[0].unshift(EmptyCell.withSpan(verticalHeadingNeededColumns, horizontalHeadingNeededRows));
            }

            computedTable.unshift(...horizontalHeadingRows);
        }


        if (verticalHeading) {

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

                if (horizontalHeading) {
                    rowIndex += horizontalHeadingNeededRows;
                }

                for (const [i, child] of vTree.childrenAtDepth(depth).entries()) {
                    let rowspan = rowspans[i];
                    let colspan = 1;
                    if (child.isLeaf()) {
                        colspan = verticalDepth - depth + 1; // we add 1 because the colspan starts at 1.
                    }

                    computedTable[rowIndex].unshift(HeadingCell.from(child, colspan, rowspan));

                    rowIndex += rowspan;
                }
            }
        }


        computedTable = new Table(computedTable);
        cellRenderer = cell => {
            if (cell instanceof HeadingCell) {
                return cell.value.value.label;
            }
            else {
                return cell.value.title;
            }
        };
    }

</script>

<div class="graph-container">
    {#if errorMessage}
        <p>{errorMessage}</p>
    {:else}
        <TableComp input={computedTable} renderer={cellRenderer} />
    {/if}
    <!--    <TableComp table={testTable} renderer="{cellRenderer2}"/>-->
    <!--    <TableComp table={flattened} renderer="{cellRenderer2}"/>-->
</div>

<style>

    .sticky {
        position: sticky;
        background-color: white;
    }

    .top {
        top:0;
    }

    .left {
        left:0;
    }

    table {
        border-spacing: 15px 15px;
    }

    td {
        padding: 10px;
        min-width: 200px;
    }

    td.heading {
        font-weight: bold;
    }

    td.box {
        border: 1px solid black;
    }

    .graph {
        height: 100%;
    }

    .graph-container {
        background-color: rgba(214,214,214,0.35);
        height: 600px;
        margin: 0 auto;
        text-align: left;
        width: 96%;
        border: 3px solid #ff3e00;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
