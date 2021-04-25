<script>

    import {data, graphOptions} from "./stores";
    import {isEmpty, buildDistinctFilterTree, TreeNode, LabeledFilter, TaffyFilter, TaffyAndFilter, buildIntegerRangeFilterTree} from "./lib";
    import TableComp from "./TableComp.svelte";
    import {buildTableFromTrees, Table, Cell, EmptyCell, HeadingCell} from "./tables";

    let localData;
    let localOptions;

    // transient, computed based on localData and localOptions
    let errorMessage;
    let queryCreator, abscissas, dataColumns, dataRows, hasVerticalDisplayField;
    let horizontalHeadingCells, verticalHeadingCells;

    // ---- NEW VERSION ----
    let verticalFilterTree, horizontalFilterTree;
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
        errorMessage = queryCreator = abscissas = dataColumns = dataRows = hasVerticalDisplayField = undefined;
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

        // Collection of all the possible values for the horizontal ordering field.
        abscissas = queryCreator().order(localOptions.horizontalDisplayField).distinct(localOptions.horizontalDisplayField);

        // --- new version

        if (localOptions.horizontalDisplayField) {
            horizontalFilterTree = buildDistinctFilterTree(localOptions.horizontalDisplayField, queryCreator().order(localOptions.horizontalDisplayField).distinct(localOptions.horizontalDisplayField) );
        }
        else {
            horizontalFilterTree = new TreeNode(new LabeledFilter(localOptions.horizontalDisplayField, {}));
        }

        if (localOptions.verticalDisplayField) {
            verticalFilterTree = buildDistinctFilterTree(localOptions.verticalDisplayField, queryCreator().order(localOptions.verticalDisplayField).distinct(localOptions.verticalDisplayField));
        }
        else {
            verticalFilterTree = new TreeNode(new LabeledFilter(localOptions.verticalDisplayField, {}));
        }

        // --- end new version

        if (abscissas.length === 0) {
            errorMessage = "No data for the given horizontal ordering field.";
            return;
        }


        hasVerticalDisplayField = !isEmpty(localOptions.verticalDisplayField);

        if (hasVerticalDisplayField && localOptions.verticalDisplayField === localOptions.horizontalDisplayField) {
            errorMessage = "Cannot use the same field for vertical and horizontal display";
            return;
        }

        horizontalHeadingCells = abscissas;
        dataRows = [];

        if (!hasVerticalDisplayField) {
            dataColumns = abscissas.map(key => TaffyFilter.columnsAre(localOptions.horizontalDisplayField, key).filter(queryCreator).get());
            // Since HTML table tag's input is row based, we need to "transpose" our columns into rows.
            let columnsLengths = dataColumns.map(c => c.length);
            let maxColumnLength = Math.max(...columnsLengths);

            for (let i = 0; i < maxColumnLength; i++) {
                dataRows[i] = [];
                for (let j = 0; j < dataColumns.length; j++) {
                    dataRows[i][j] = i < columnsLengths[j] ? dataColumns[j][i] : undefined;
                }
            }
        }
        else {

            verticalHeadingCells = [];
            let ordinates = queryCreator().order(localOptions.verticalDisplayField).distinct(localOptions.verticalDisplayField);

            ordinates.forEach(ordinate => {
                // console.log("ordinate = " + ordinate);
                let filterCreator = abscissa => TaffyFilter.columnsAre(localOptions.horizontalDisplayField, abscissa, localOptions.verticalDisplayField, ordinate);
                let cells = abscissas.map(abscissa => filterCreator(abscissa).filter(queryCreator()).get());

                let neededRows = Math.max(...abscissas.map(key => {
                    return filterCreator(key).filter(queryCreator()).get().length;
                }));

                // console.log("neededRows = " + neededRows)
                // console.log("cells = " + JSON.stringify(cells))

                for (let i = 0; i < neededRows; i++) {
                    verticalHeadingCells.push(i === 0 ? ordinate : "");

                    let row = [];
                    for (let j = 0; j < abscissas.length; j++) {
                        if (i <= cells[j].length) {
                            row[j] = cells[j][i];
                        }
                        else {
                            // row[j] = {title: "i = " + i + " j = " + j + " abs[j] = " + abscissas[j]};
                            row[j] = undefined;
                        }
                    }

                    // console.log("ordinate = " + ordinate + ", i = " + i);
                    // console.log("row = " + JSON.stringify(row));

                    dataRows.push(row);
                }
            });
        }

        let hTree = buildIntegerRangeFilterTree("date", 1900, 1920, 2);
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
        let allowColSpan = false;

        let leavesMaxHeight = [];

        for (let [recordsRowIndex, recordsRow] of records.entries()) {
            // Calculate maximum height
            let maxHeight = Math.max(...recordsRow.map(recordsCell => recordsCell.length));
            maxHeight = Math.max(maxHeight, 1);
            leavesMaxHeight[recordsRowIndex] = maxHeight;

            let calculatedRows = [];

            for (let i = 0; i < maxHeight; i++) {
                let emptyRow = [];

                for (let j = 0; j < hTree.leavesCount(); j++) {
                    emptyRow.push(EmptyCell.INSTANCE);
                }

                calculatedRows.push(emptyRow);
            }

            recordsRow.forEach((recordsCell, column) => {
                if (!allowColSpan) {
                    for (const [line, record] of recordsCell.entries()) {
                        calculatedRows[line][column] = new Cell(record);
                    }
                }
                else {
                    // TODO: colspan
                }
            });

            computedTable.push(...calculatedRows);
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
        <div class="graph">
            <table>
                <tbody>
                    <tr class="sticky top">
                        {#if hasVerticalDisplayField}
                            <!-- TODO: insert ordering fields name here -->
                            <td class="sticky left"></td>
                        {/if}
                        {#each horizontalHeadingCells as horizontalHeading}
                            <td class="heading">
                                {horizontalHeading}
                            </td>
                        {/each}
                    </tr>
                    {#each dataRows as row, i}
                        <tr>
                            {#if hasVerticalDisplayField}
                                    <td class="heading sticky left">{verticalHeadingCells[i]}</td>
                            {/if}
                            {#each row as value}
                                {#if value}
                                    <td class="box">{value.title}</td>
                                {:else}
                                    <td></td>
                                {/if}
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>



<div class="graph-container">
    <TableComp input={computedTable} renderer={cellRenderer} />
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
